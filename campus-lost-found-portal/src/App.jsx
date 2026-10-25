import React, { useEffect, useMemo, useState } from "react";
import { getItems, createItem, updateItem } from "./api";
import {
  Search, Plus, MapPin, CalendarDays, ArrowUpRight, PackageSearch,
  HeartHandshake, ShieldCheck, X, CheckCircle2, Clock3, Filter,
  BookOpen, Smartphone, KeyRound, Wallet, Headphones, MoreHorizontal
} from "lucide-react";

const starterItems = [
  { id: 1, title: "Blue water bottle", category: "Accessories", location: "Central Library", date: "2026-10-22", type: "Found", status: "Available", description: "A blue insulated bottle found near the second-floor study tables.", contact: "library.help@campus.edu", color: "blue" },
  { id: 2, title: "Student ID card", category: "Documents", location: "Cafeteria", date: "2026-10-21", type: "Lost", status: "Missing", description: "Student ID card misplaced around the cafeteria during lunch.", contact: "student@example.com", color: "peach" },
  { id: 3, title: "Wireless earbuds case", category: "Electronics", location: "Block C, Room 204", date: "2026-10-20", type: "Found", status: "Available", description: "White earbuds case found after the afternoon lecture.", contact: "blockc.office@campus.edu", color: "lilac" },
  { id: 4, title: "Set of keys", category: "Accessories", location: "Sports Ground", date: "2026-10-19", type: "Lost", status: "Missing", description: "Two keys on a small green keychain.", contact: "student@example.com", color: "mint" },
  { id: 5, title: "Calculus notebook", category: "Books & Notes", location: "Engineering Block", date: "2026-10-18", type: "Found", status: "Available", description: "A ruled notebook with handwritten calculus notes.", contact: "department.office@campus.edu", color: "yellow" },
  { id: 6, title: "Black wallet", category: "Personal Items", location: "Bus Stop Gate 2", date: "2026-10-17", type: "Lost", status: "Missing", description: "Small black wallet. Please contact if found.", contact: "student@example.com", color: "rose" }
];

const categories = ["All categories", "Electronics", "Books & Notes", "Documents", "Accessories", "Personal Items", "Other"];
const iconFor = (category) => {
  if (category === "Electronics") return Smartphone;
  if (category === "Books & Notes") return BookOpen;
  if (category === "Documents") return ShieldCheck;
  if (category === "Accessories") return KeyRound;
  if (category === "Personal Items") return Wallet;
  return Headphones;
};
const prettyDate = (date) => new Date(date + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

function App() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    getItems()
    .then(data => setItems(data))
    .catch(error => console.error("Error loading items:", error))
    .finally(() => setLoading(false));
}, []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [typeFilter, setTypeFilter] = useState("All items");
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ title: "", type: "Lost", category: "Electronics", location: "", date: new Date().toISOString().slice(0, 10), description: "", contact: "" });

  const saveItems = (next) => {
    setItems(next);
    try { localStorage.setItem("campus-connect-items", JSON.stringify(next)); } catch {}
  };

  const filteredItems = useMemo(() => items.filter(item => {
    const matchesQuery = `${item.title} ${item.location} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All categories" || item.category === category;
    const matchesType = typeFilter === "All items" || item.type === typeFilter;
    return matchesQuery && matchesCategory && matchesType;
  }), [items, query, category, typeFilter]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

const submitItem = async (event) => {
  event.preventDefault();

  const newItem = {
    ...form,
    color: ["blue", "peach", "lilac", "mint", "yellow", "rose"][items.length % 6],
  };

  try {
    const savedItem = await createItem(newItem);

    setItems(previous => [savedItem, ...previous]);
    setModalOpen(false);

    setForm({
      title: "",
      type: "Lost",
      category: "Electronics",
      location: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      contact: "",
    });

    showToast("Your listing has been saved to the database!");
  } catch (error) {
    console.error("Error saving item:", error);
    showToast("Could not save item. Check the backend.");
  }
};

const markClaimed = async (id) => {
  const item = items.find(item => item.id === id);

  if (!item) return;

  try {
    const updatedItem = await updateItem(item);

    setItems(previous =>
      previous.map(existing =>
        existing.id === id ? updatedItem : existing
      )
    );

    showToast("Item marked as claimed!");
  } catch (error) {
    console.error("Error updating item:", error);
    showToast("Could not update item. Check the backend.");
  }
};

  const lostCount = items.filter(item => item.type === "Lost" && item.status !== "Claimed").length;
  const foundCount = items.filter(item => item.type === "Found" && item.status !== "Claimed").length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Campus Connect home">
          <span className="brand-mark"><HeartHandshake size={22} /></span>
          <span>campus<span className="brand-light">connect</span><small>LOST & FOUND</small></span>
        </a>
        <nav className="nav-links">
          <a className="active" href="#browse">Browse items</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="button button-dark top-cta" onClick={() => setModalOpen(true)}><Plus size={17} /> Report an item</button>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"></span> YOUR CAMPUS, CONNECTED</div>
            <h1>Lost something?<br /><span>Let's find it together.</span></h1>
            <p className="hero-text">A little help from your campus community can go a long way. Report lost belongings, share found items, and help things find their way home.</p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={() => { setForm(f => ({ ...f, type: "Lost" })); setModalOpen(true); }}><Search size={17} /> I've lost something</button>
              <button className="button button-outline" onClick={() => { setForm(f => ({ ...f, type: "Found" })); setModalOpen(true); }}><Plus size={17} /> I found something</button>
            </div>
            <div className="trust-line"><ShieldCheck size={16} /> Community-powered. Simple. Helpful.</div>
          </div>
          <div className="hero-art" aria-label="Illustration of lost and found belongings">
            <div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div>
            <div className="art-card card-note"><span className="note-spark">✳</span><div className="mini-label">GOOD THINGS</div><strong>find their<br />way back.</strong><span className="scribble">〰</span></div>
            <div className="art-object bottle"><div className="bottle-cap"></div><div className="bottle-face">☺</div><div className="bottle-star">✦</div></div>
            <div className="art-object notebook"><div className="notebook-line"></div><div className="notebook-line"></div><div className="notebook-line"></div><span>notes<br />& ideas</span></div>
            <div className="art-object keyring"><KeyRound size={40} strokeWidth={1.5} /><span className="key-dot"></span></div>
            <div className="floating-tag tag-found"><CheckCircle2 size={14} /> FOUND!</div>
            <div className="floating-tag tag-kind">kindness looks good on you ♡</div>
          </div>
        </section>

        <section className="stats-row" aria-label="Community statistics">
          <div className="stat"><span className="stat-icon stat-purple"><PackageSearch size={20} /></span><div><strong>{items.length}</strong><span>Total listings</span></div></div>
          <div className="stat"><span className="stat-icon stat-orange"><Search size={20} /></span><div><strong>{lostCount}</strong><span>Items reported lost</span></div></div>
          <div className="stat"><span className="stat-icon stat-green"><HeartHandshake size={20} /></span><div><strong>{foundCount}</strong><span>Items found</span></div></div>
          <div className="stat-note"><span className="note-heart">♡</span> Small acts of help make a big difference.</div>
        </section>

        <section className="browse-section" id="browse">
          <div className="section-heading">
            <div><div className="eyebrow">THE COMMUNITY BOARD</div><h2>Find your missing piece.</h2><p>Browse recent reports from around campus.</p></div>
            <button className="button button-dark" onClick={() => setModalOpen(true)}><Plus size={17} /> Post a listing</button>
          </div>
          <div className="filters">
            <label className="search-box"><Search size={18} /><input aria-label="Search items" placeholder="Search by item, place, or keyword..." value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></label>
            <label className="select-wrap"><Filter size={16} /><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
            <div className="segmented" aria-label="Filter by listing type">{["All items", "Lost", "Found"].map(t => <button key={t} className={typeFilter === t ? "selected" : ""} onClick={() => setTypeFilter(t)}>{t}</button>)}</div>
          </div>
          {filteredItems.length ? <div className="item-grid">
            {filteredItems.map(item => {
              const Icon = iconFor(item.category);
              return <article className="item-card" key={item.id}>
                <div className={`item-visual ${item.color || "blue"}`}><span className={`type-badge ${item.type.toLowerCase()}`}>{item.type === "Lost" ? "● Lost item" : "● Found item"}</span><div className="visual-icon"><Icon size={38} strokeWidth={1.45} /></div><span className="visual-decor">✳</span></div>
                <div className="item-content">
                  <div className="item-category">{item.category}</div>
                  <h3>{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta"><span><MapPin size={14} />{item.location}</span><span><CalendarDays size={14} />{prettyDate(item.date)}</span></div>
                  <div className="item-footer"><span className={`status ${item.status.toLowerCase()}`}><span></span>{item.status}</span>{item.status !== "Claimed" && <button className="text-button" onClick={() => markClaimed(item.id)}>Mark claimed <ArrowUpRight size={14} /></button>}</div>
                </div>
              </article>;
            })}
          </div> : <div className="empty-state"><PackageSearch size={34} /><h3>No items found</h3><p>Try another keyword or clear your filters.</p><button className="button button-outline" onClick={() => { setQuery(""); setCategory("All categories"); setTypeFilter("All items"); }}>Clear filters</button></div>}
          <div className="privacy-note"><ShieldCheck size={16} /><span><strong>A little privacy reminder:</strong> Don't post sensitive personal details publicly. Verify an item's ownership before handing it over.</span></div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-heading"><div className="eyebrow">THREE LITTLE STEPS</div><h2>Helping things find their way home.</h2></div>
          <div className="steps-grid">
            <div className="step"><div className="step-number">01</div><div className="step-icon"><Search size={22} /></div><h3>Search the board</h3><p>Look through recent lost and found reports or use filters to narrow things down.</p></div>
            <div className="step"><div className="step-number">02</div><div className="step-icon"><Plus size={22} /></div><h3>Share a listing</h3><p>Tell the campus community what went missing or what you've picked up.</p></div>
            <div className="step"><div className="step-number">03</div><div className="step-icon"><HeartHandshake size={22} /></div><h3>Reconnect & reclaim</h3><p>Coordinate safely with the owner and mark the item as claimed when it's returned.</p></div>
          </div>
        </section>

        <section className="bottom-cta"><div><span className="cta-spark">✳</span><h2>Found something that isn't yours?</h2><p>Be someone's favourite person today. Add it to the board.</p></div><button className="button button-white" onClick={() => { setForm(f => ({ ...f, type: "Found" })); setModalOpen(true); }}>Post a found item <ArrowUpRight size={17} /></button></section>
      </main>

      <footer><a className="brand footer-brand" href="#home"><span className="brand-mark"><HeartHandshake size={19} /></span><span>campus<span className="brand-light">connect</span><small>LOST & FOUND</small></span></a><span>Made for a more helpful campus. <span className="footer-heart">♥</span></span><span>Student community project · 2026</span></footer>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><div><div className="eyebrow">COMMUNITY BOARD</div><h2 id="modal-title">Add a listing</h2><p>Share a few details so the community can help.</p></div><button className="icon-button" aria-label="Close form" onClick={() => setModalOpen(false)}><X size={20} /></button></div>
          <form onSubmit={submitItem}>
            <div className="form-row type-choice"><label className={form.type === "Lost" ? "choice active-choice" : "choice"}><input type="radio" name="type" value="Lost" checked={form.type === "Lost"} onChange={e => setForm({ ...form, type: e.target.value })} /><Search size={17} /> I lost something</label><label className={form.type === "Found" ? "choice active-choice" : "choice"}><input type="radio" name="type" value="Found" checked={form.type === "Found"} onChange={e => setForm({ ...form, type: e.target.value })} /><HeartHandshake size={17} /> I found something</label></div>
            <label className="field-label">Item name *<input required maxLength="60" placeholder="e.g. Blue water bottle" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
            <div className="form-row"><label className="field-label">Category *<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.slice(1).map(c => <option key={c}>{c}</option>)}</select></label><label className="field-label">Date *<input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label></div>
            <label className="field-label">Location *<input required maxLength="80" placeholder="Where was it lost or found?" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></label>
            <label className="field-label">Description *<textarea required rows="3" maxLength="300" placeholder="Describe the item and any identifying details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
            <label className="field-label">Contact email *<input required type="email" placeholder="you@example.com" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></label>
            <p className="form-privacy"><ShieldCheck size={15} /> Demo project: listings are saved in this browser only. Avoid entering real private information.</p>
            <div className="modal-actions"><button type="button" className="button button-outline" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="button button-dark"><Plus size={16} /> Publish listing</button></div>
          </form>
        </div>
      </div>}
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

export default App;

const API_URL = "http://localhost:8080/api/items";

export async function getItems() {
const response = await fetch(API_URL);

if (!response.ok) {
throw new Error("Could not load items");
}

const data = await response.json();

return data.map(item => ({
...item,
title: item.name,
type: item.status === "Missing" ? "Lost" : "Found",
color: "blue",
}));
}

export async function createItem(item) {
const response = await fetch(API_URL, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
name: item.title,
category: item.category,
description: item.description,
location: item.location,
date: item.date,
status: item.type === "Found" ? "Available" : "Missing",
contact: item.contact,
}),
});

if (!response.ok) {
throw new Error("Could not save item");
}

const savedItem = await response.json();

return {
...savedItem,
title: savedItem.name,
type: item.type,
color: item.color,
};
}

export async function updateItem(item) {
const response = await fetch(`${API_URL}/${item.id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
name: item.title,
category: item.category,
description: item.description,
location: item.location,
date: item.date,
status: "Claimed",
contact: item.contact,
}),
});

if (!response.ok) {
throw new Error("Could not update item");
}

const savedItem = await response.json();

return {
...savedItem,
title: savedItem.name,
type: item.type,
color: item.color,
};
}

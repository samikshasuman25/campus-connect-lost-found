package com.campus.lostfound;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {


private final ItemRepository itemRepository;

public ItemController(ItemRepository itemRepository) {
    this.itemRepository = itemRepository;
}

@GetMapping
public List<Item> getAllItems() {
    return itemRepository.findAll();
}

@GetMapping("/{id}")
public Item getItemById(@PathVariable Long id) {
    return itemRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Item not found"));
}

@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Item createItem(@RequestBody Item item) {
    item.setId(null);
    return itemRepository.save(item);
}

@PutMapping("/{id}")
public Item updateItem(@PathVariable Long id, @RequestBody Item updatedItem) {
    Item item = itemRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Item not found"));

    item.setName(updatedItem.getName());
    item.setCategory(updatedItem.getCategory());
    item.setDescription(updatedItem.getDescription());
    item.setDate(updatedItem.getDate());
    item.setLocation(updatedItem.getLocation());
    item.setStatus(updatedItem.getStatus());
    item.setContact(updatedItem.getContact());

    return itemRepository.save(item);
}

@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteItem(@PathVariable Long id) {
    if (!itemRepository.existsById(id)) {
        throw new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Item not found");
    }

    itemRepository.deleteById(id);
}


}

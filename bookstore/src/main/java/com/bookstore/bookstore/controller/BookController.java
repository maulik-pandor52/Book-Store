package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(service.getAllBooks());
    }

    @PostMapping
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        if (book.getName() == null || book.getName().isBlank() || book.getAuthor() == null || book.getAuthor().isBlank() || book.getPrice() < 0 || book.getQuantity() < 0) return ResponseEntity.badRequest().body(Map.of("error", "Book name, author, non-negative price and stock are required."));
        service.save(book);
        return ResponseEntity.ok(Map.of("message", "Book added successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable int id, @RequestBody Book book) {
        if (service.getById(id) == null) return ResponseEntity.status(404).body(Map.of("error", "Book not found."));
        if (book.getName() == null || book.getName().isBlank() || book.getAuthor() == null || book.getAuthor().isBlank() || book.getPrice() < 0 || book.getQuantity() < 0) return ResponseEntity.badRequest().body(Map.of("error", "Book name, author, non-negative price and stock are required."));
        book.setId(id);
        service.save(book);
        return ResponseEntity.ok(Map.of("message", "Book updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable int id) {
        if (service.getById(id) == null) return ResponseEntity.status(404).body(Map.of("error", "Book not found."));
        service.delete(id);
        return ResponseEntity.ok(Map.of("message", "Book deleted successfully"));
    }
}

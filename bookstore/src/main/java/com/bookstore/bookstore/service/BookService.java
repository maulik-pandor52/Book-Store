package com.bookstore.bookstore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.repository.BookRepository;

@Component
public class BookService {

    @Autowired
    private BookRepository repo;      

    public void save(Book book) {
        repo.save(book);
    }

    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    public void delete(int id) {
        repo.deleteById(id);
    }

    public Book getById(Integer id) {
        return repo.findById(id).orElse(null);
    }
}
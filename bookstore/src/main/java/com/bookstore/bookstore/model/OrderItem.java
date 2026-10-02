package com.bookstore.bookstore.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "order_id") @JsonBackReference
    private BookOrder order;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "book_id")
    private Book book;
    private String bookName;
    private String author;
    private int quantity;
    private double price;

    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public BookOrder getOrder() { return order; } public void setOrder(BookOrder order) { this.order = order; }
    public Book getBook() { return book; } public void setBook(Book book) { this.book = book; }
    public String getBookName() { return bookName; } public void setBookName(String bookName) { this.bookName = bookName; }
    public String getAuthor() { return author; } public void setAuthor(String author) { this.author = author; }
    public int getQuantity() { return quantity; } public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getPrice() { return price; } public void setPrice(double price) { this.price = price; }
}

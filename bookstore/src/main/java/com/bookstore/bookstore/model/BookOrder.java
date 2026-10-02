package com.bookstore.bookstore.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "book_orders")
public class BookOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();

    private double totalAmount;
    private LocalDateTime orderDate;
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    private String shippingAddress;
    private String paymentId;

    public int getId() { return id; } public void setId(int id) { this.id = id; }
    public AppUser getUser() { return user; } public void setUser(AppUser user) { this.user = user; }
    public List<OrderItem> getItems() { return items; } public void setItems(List<OrderItem> items) { this.items = items; }
    public double getTotalAmount() { return totalAmount; } public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getOrderDate() { return orderDate; } public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public OrderStatus getStatus() { return status; } public void setStatus(OrderStatus status) { this.status = status; }
    public String getShippingAddress() { return shippingAddress; } public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public String getPaymentId() { return paymentId; } public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}

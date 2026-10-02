package com.bookstore.bookstore.service;

import com.bookstore.bookstore.model.*;
import com.bookstore.bookstore.repository.OrderRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final BookService bookService;
    public OrderService(OrderRepository orderRepository, CartService cartService, BookService bookService) { this.orderRepository = orderRepository; this.cartService = cartService; this.bookService = bookService; }

    @Transactional
    public BookOrder createFromCart(AppUser user, String paymentId, String shippingAddress) {
        List<Cart> cartItems = cartService.getCartForUser(user.getId());
        if (cartItems.isEmpty()) throw new IllegalStateException("Your cart is empty.");
        BookOrder order = new BookOrder(); order.setUser(user); order.setOrderDate(LocalDateTime.now()); order.setPaymentId(paymentId); order.setShippingAddress(shippingAddress == null || shippingAddress.isBlank() ? user.getAddress() : shippingAddress);
        double total = 0;
        for (Cart cart : cartItems) {
            Book book = bookService.getById(cart.getBookId());
            if (book == null) throw new IllegalStateException("A book in your cart no longer exists.");
            if (book.getQuantity() < cart.getQuantity()) throw new IllegalStateException(book.getName() + " does not have enough stock.");
            OrderItem item = new OrderItem(); item.setOrder(order); item.setBook(book); item.setBookName(book.getName()); item.setAuthor(book.getAuthor()); item.setPrice(book.getPrice()); item.setQuantity(cart.getQuantity());
            order.getItems().add(item); total += book.getPrice() * cart.getQuantity();
            book.setQuantity(book.getQuantity() - cart.getQuantity()); bookService.save(book);
        }
        order.setTotalAmount(total);
        BookOrder saved = orderRepository.save(order);
        cartService.clearForUser(user.getId());
        return saved;
    }
    public List<BookOrder> myOrders(int userId) { return orderRepository.findByUserIdOrderByOrderDateDesc(userId); }
    public List<BookOrder> allOrders() { return orderRepository.findAllByOrderByOrderDateDesc(); }
    public BookOrder updateStatus(int id, OrderStatus status) { BookOrder order = orderRepository.findById(id).orElseThrow(() -> new java.util.NoSuchElementException("Order not found.")); order.setStatus(status); return orderRepository.save(order); }
    public long count() { return orderRepository.count(); }
    public long countByStatus(OrderStatus status) { return orderRepository.countByStatus(status); }
    public double totalRevenue() { return orderRepository.findAll().stream().filter(order -> order.getStatus() != OrderStatus.CANCELLED).mapToDouble(BookOrder::getTotalAmount).sum(); }
}

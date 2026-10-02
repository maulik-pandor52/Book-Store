package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.model.OrderStatus;
import com.bookstore.bookstore.service.AuthService;
import com.bookstore.bookstore.service.BookService;
import com.bookstore.bookstore.service.OrderService;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AuthService authService; private final BookService bookService; private final OrderService orderService;
    public AdminController(AuthService authService, BookService bookService, OrderService orderService) { this.authService = authService; this.bookService = bookService; this.orderService = orderService; }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", authService.count()); stats.put("totalBooks", bookService.count()); stats.put("totalOrders", orderService.count()); stats.put("totalRevenue", orderService.totalRevenue());
        stats.put("pendingOrders", orderService.countByStatus(OrderStatus.PENDING)); stats.put("confirmedOrders", orderService.countByStatus(OrderStatus.CONFIRMED));
        stats.put("shippedOrders", orderService.countByStatus(OrderStatus.SHIPPED)); stats.put("deliveredOrders", orderService.countByStatus(OrderStatus.DELIVERED)); stats.put("cancelledOrders", orderService.countByStatus(OrderStatus.CANCELLED));
        stats.put("recentOrders", orderService.allOrders().stream().limit(5).map(OrderController::orderResponse).toList());
        return ResponseEntity.ok(stats);
    }
    @GetMapping("/orders") public ResponseEntity<?> orders() { return ResponseEntity.ok(orderService.allOrders().stream().map(OrderController::orderResponse).toList()); }
    @PatchMapping("/orders/{id}/status") public ResponseEntity<?> updateOrderStatus(@PathVariable int id, @RequestBody Map<String, String> payload) {
        try { return ResponseEntity.ok(OrderController.orderResponse(orderService.updateStatus(id, OrderStatus.valueOf(payload.getOrDefault("status", "").toUpperCase())))); }
        catch (IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("error", "Invalid order status.")); }
        catch (java.util.NoSuchElementException ex) { return ResponseEntity.status(404).body(Map.of("error", ex.getMessage())); }
    }
    @GetMapping("/users") public ResponseEntity<?> users() { return ResponseEntity.ok(authService.findAll().stream().map(this::userResponse).toList()); }
    private Map<String, Object> userResponse(AppUser user) { return Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail() == null ? "" : user.getEmail(), "phoneNumber", user.getPhoneNumber() == null ? "" : user.getPhoneNumber(), "role", user.getRole()); }
}

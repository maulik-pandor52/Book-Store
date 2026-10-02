package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.model.BookOrder;
import com.bookstore.bookstore.model.OrderItem;
import com.bookstore.bookstore.service.OrderService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @GetMapping("/my-orders")
    public ResponseEntity<?> myOrders(@AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(orderService.myOrders(user.getId()).stream().map(OrderController::orderResponse).toList());
    }

    static Map<String, Object> orderResponse(BookOrder order) {
        return Map.of("id", order.getId(), "customer", Map.of("id", order.getUser().getId(), "name", order.getUser().getName(), "email", order.getUser().getEmail() == null ? "" : order.getUser().getEmail()),
            "totalAmount", order.getTotalAmount(), "orderDate", order.getOrderDate().toString(), "status", order.getStatus().name(), "shippingAddress", order.getShippingAddress() == null ? "" : order.getShippingAddress(),
            "items", order.getItems().stream().map(thisItem -> Map.of("id", thisItem.getId(), "bookId", thisItem.getBook() == null ? 0 : thisItem.getBook().getId(), "bookName", thisItem.getBookName(), "author", thisItem.getAuthor(), "quantity", thisItem.getQuantity(), "price", thisItem.getPrice())).toList());
    }
}

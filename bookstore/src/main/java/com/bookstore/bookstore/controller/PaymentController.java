package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.service.BookService;
import com.bookstore.bookstore.service.CartService;
import com.bookstore.bookstore.service.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final CartService cartService;
    private final BookService bookService;
    private final OrderService orderService;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    public PaymentController(CartService cartService, BookService bookService, OrderService orderService) {
        this.cartService = cartService;
        this.bookService = bookService;
        this.orderService = orderService;
    }

    @GetMapping("/checkout")
    public ResponseEntity<?> checkout(@AuthenticationPrincipal AppUser user) {
        var items = cartService.getCartForUser(user.getId());
        if (items.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Your cart is empty."));
        }

        double total = cartService.getTotalForUser(user.getId());
        return ResponseEntity.ok(Map.of(
                "cartItems", items,
                "total", total,
                "amountInPaise", Math.round(total * 100),
                "razorpayKeyId", razorpayKeyId
        ));
    }

    @PostMapping("/success")
    public ResponseEntity<?> paymentSuccess(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal AppUser user) {

        String paymentId = payload.get("razorpay_payment_id");

        try {
            var order = orderService.createFromCart(user, paymentId, payload.get("shippingAddress"));
            return ResponseEntity.ok(Map.of("message", "Payment successful. Your order has been placed.", "paymentId", paymentId == null ? "" : paymentId, "orderId", order.getId()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}

package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.service.BookService;
import com.bookstore.bookstore.service.CartService;
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

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    public PaymentController(CartService cartService, BookService bookService) {
        this.cartService = cartService;
        this.bookService = bookService;
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

        var items = cartService.getCartForUser(user.getId());
        for (var item : items) {
            com.bookstore.bookstore.model.Book book = bookService.getById(item.getBookId());
            if (book != null && book.getQuantity() > 0) {
                book.setQuantity(book.getQuantity() - 1);
                bookService.save(book);
            }
        }

        cartService.clearForUser(user.getId());
        return ResponseEntity.ok(Map.of("message", "Payment successful.", "paymentId", paymentId));
    }
}

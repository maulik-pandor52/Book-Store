package com.bookstore.bookstore.controller;

import com.bookstore.bookstore.model.AppUser;
import com.bookstore.bookstore.model.Book;
import com.bookstore.bookstore.model.Cart;
import com.bookstore.bookstore.service.BookService;
import com.bookstore.bookstore.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final BookService bookService;

    public CartController(CartService cartService, BookService bookService) {
        this.cartService = cartService;
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal AppUser user) {
        List<Cart> items = cartService.getCartForUser(user.getId());
        double total = cartService.getTotalForUser(user.getId());
        return ResponseEntity.ok(Map.of("items", items, "total", total));
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<?> addToCart(@PathVariable int bookId, @AuthenticationPrincipal AppUser user) {
        Book b = bookService.getById(bookId);
        if (b == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Book not found"));
        }
        if (b.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Book out of stock"));
        }

        Cart cart = new Cart();
        cart.setName(b.getName());
        cart.setAuthor(b.getAuthor());
        cart.setPrice(b.getPrice());
        cart.setBookId(b.getId());
        cart.setUserId(user.getId());

        cartService.save(cart);

        return ResponseEntity.ok(Map.of("message", "Added to cart"));
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<?> removeFromCart(@PathVariable int cartId, @AuthenticationPrincipal AppUser user) {
        cartService.delete(cartId);
        return ResponseEntity.ok(Map.of("message", "Removed from cart"));
    }
}

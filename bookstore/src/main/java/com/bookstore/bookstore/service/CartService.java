package com.bookstore.bookstore.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookstore.bookstore.model.Cart;
import com.bookstore.bookstore.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository repo;

    public void save(Cart cart) {
        repo.save(cart);
    }

    @org.springframework.transaction.annotation.Transactional
    public List<Cart> getCartForUser(int userId) {
        return repo.findByUserId(userId);
    }

    public double getTotalForUser(int userId) {
        return repo.findByUserId(userId).stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public boolean deleteForUser(int id, int userId) {
        return repo.findById(id)
                .filter(item -> item.getUserId() == userId)
                .map(item -> { repo.delete(item); return true; })
                .orElse(false);
    }

    @org.springframework.transaction.annotation.Transactional
    public void clearForUser(int userId) {
        repo.deleteByUserId(userId);
    }
}

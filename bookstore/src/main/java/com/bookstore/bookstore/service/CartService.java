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
                .mapToDouble(Cart::getPrice)
                .sum();
    }

    public void delete(int id) {
        repo.deleteById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public void clearForUser(int userId) {
        repo.deleteByUserId(userId);
    }
}

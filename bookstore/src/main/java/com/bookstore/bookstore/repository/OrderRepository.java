package com.bookstore.bookstore.repository;

import com.bookstore.bookstore.model.BookOrder;
import com.bookstore.bookstore.model.OrderStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<BookOrder, Integer> {
    List<BookOrder> findByUserIdOrderByOrderDateDesc(int userId);
    List<BookOrder> findAllByOrderByOrderDateDesc();
    long countByStatus(OrderStatus status);
}

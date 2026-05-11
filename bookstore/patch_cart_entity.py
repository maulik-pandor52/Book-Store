import sys

# 1. Update Cart.java
with open('src/main/java/com/bookstore/bookstore/model/Cart.java', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''    private double price;
    private int bookId;'''
replacement1 = '''    private double price;
    private int bookId;
    private int userId;'''

target2 = '''    public void setBookId(int bookId) {
        this.bookId = bookId;
    }
}'''
replacement2 = '''    public void setBookId(int bookId) {
        this.bookId = bookId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}'''

content = content.replace(target1, replacement1).replace(target2, replacement2)
with open('src/main/java/com/bookstore/bookstore/model/Cart.java', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update CartRepository.java
with open('src/main/java/com/bookstore/bookstore/repository/CartRepository.java', 'r', encoding='utf-8') as f:
    repo_content = f.read()

repo_target = '''public interface CartRepository extends JpaRepository<Cart, Integer> {
}'''
repo_replacement = '''import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findByUserId(int userId);
    void deleteByUserId(int userId);
}'''

repo_content = repo_content.replace(repo_target, repo_replacement)
with open('src/main/java/com/bookstore/bookstore/repository/CartRepository.java', 'w', encoding='utf-8') as f:
    f.write(repo_content)

# 3. Update CartService.java
with open('src/main/java/com/bookstore/bookstore/service/CartService.java', 'r', encoding='utf-8') as f:
    service_content = f.read()

service_target = '''    public List<Cart> getAll() {
        return repo.findAll();
    }

    public double getTotal() {
        return repo.findAll().stream()
                .mapToDouble(Cart::getPrice)
                .sum();
    }

    public void delete(int id) {
        repo.deleteById(id);
    }

    public void clear() {
        repo.deleteAll();
    }'''
service_replacement = '''    @org.springframework.transaction.annotation.Transactional
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
    }'''

service_content = service_content.replace(service_target, service_replacement)
with open('src/main/java/com/bookstore/bookstore/service/CartService.java', 'w', encoding='utf-8') as f:
    f.write(service_content)

print('Cart backend patched')

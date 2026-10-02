import sys

with open('src/main/java/com/bookstore/bookstore/controller/PaymentController.java', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''    private final CartService cartService;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    public PaymentController(CartService cartService) {
        this.cartService = cartService;
    }'''

replacement1 = '''    private final CartService cartService;
    private final com.bookstore.bookstore.service.BookService bookService;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    public PaymentController(CartService cartService, com.bookstore.bookstore.service.BookService bookService) {
        this.cartService = cartService;
        this.bookService = bookService;
    }'''

target2 = '''    @PostMapping("/payment-success")
    public String paymentSuccess(
            @RequestParam(required = false) String razorpay_payment_id,
            RedirectAttributes redirectAttributes) {

        cartService.clear();'''

replacement2 = '''    @PostMapping("/payment-success")
    public String paymentSuccess(
            @RequestParam(required = false) String razorpay_payment_id,
            RedirectAttributes redirectAttributes) {

        var items = cartService.getAll();
        for (var item : items) {
            com.bookstore.bookstore.model.Book book = bookService.getById(item.getBookId());
            if (book != null && book.getQuantity() > 0) {
                book.setQuantity(book.getQuantity() - 1);
                bookService.save(book);
            }
        }

        cartService.clear();'''

content = content.replace(target1, replacement1).replace(target2, replacement2)

with open('src/main/java/com/bookstore/bookstore/controller/PaymentController.java', 'w', encoding='utf-8') as f:
    f.write(content)
print('Payment Controller patched')

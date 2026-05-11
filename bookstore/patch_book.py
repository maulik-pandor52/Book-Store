import sys

with open('src/main/java/com/bookstore/bookstore/controller/BookController.java', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    @GetMapping("/cart/{id}")\n    public String addToCart(@PathVariable int id, HttpSession session) {\n\n        if (session.getAttribute("currentUser") == null) {\n            return "redirect:/login";\n        }\n\n        Book b = service.getById(id);\n\n        if (b == null) { // safety\n            return "redirect:/books";\n        }\n\n        Cart cart = new Cart();\n        cart.setName(b.getName());\n        cart.setAuthor(b.getAuthor());\n        cart.setPrice(b.getPrice());'''

replacement = '''    @GetMapping("/cart/{id}")\n    public String addToCart(@PathVariable int id, HttpSession session, org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {\n\n        if (session.getAttribute("currentUser") == null) {\n            return "redirect:/login";\n        }\n\n        Book b = service.getById(id);\n\n        if (b == null) { // safety\n            return "redirect:/books";\n        }\n\n        if (b.getQuantity() <= 0) {\n            redirectAttributes.addFlashAttribute("error", "Sorry, this book is currently out of stock!");\n            return "redirect:/books";\n        }\n\n        Cart cart = new Cart();\n        cart.setName(b.getName());\n        cart.setAuthor(b.getAuthor());\n        cart.setPrice(b.getPrice());\n        cart.setBookId(b.getId());'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/main/java/com/bookstore/bookstore/controller/BookController.java', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Replaced')
else:
    print('Target not found')

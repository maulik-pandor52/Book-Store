import sys

with open('src/main/resources/templates/books.html', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''<i class="fas fa-books"></i>'''
replacement1 = '''<i class="fas fa-book"></i>'''

target2 = '''                                <a th:href="@{/delete/{id}(id=${b.id})}" class="btn-action btn-delete"
                                    onclick="return confirm('⚠️ Are you sure you want to delete this book? This action cannot be undone.');"
                                    data-tooltip="Delete Book">'''
replacement2 = '''                                <a th:href="@{/delete/{id}(id=${b.id})}" class="btn-action btn-delete"
                                    data-tooltip="Delete Book">'''

target3 = '''        // Add loading state to buttons
        document.querySelectorAll('.btn-add, .btn-cart-action, .btn-action').forEach(button => {
            button.addEventListener('click', function (e) {
                if (!this.classList.contains('disabled') && !this.classList.contains('btn-delete')) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<span class="loading-spinner"></span> Loading...';
                    this.disabled = true;

                    // Re-enable after navigation (won't actually execute due to navigation)
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        });'''
        
replacement3 = '''        // Add loading state to buttons
        document.querySelectorAll('.btn-add, .btn-cart-action, .btn-action').forEach(button => {
            button.addEventListener('click', function (e) {
                if (!this.classList.contains('disabled') && !this.classList.contains('btn-delete')) {
                    this.style.opacity = '0.7';
                    this.style.pointerEvents = 'none';
                    setTimeout(() => {
                        this.style.opacity = '1';
                        this.style.pointerEvents = 'auto';
                    }, 2000);
                }
            });
        });'''

content = content.replace(target1, replacement1).replace(target2, replacement2).replace(target3, replacement3)

with open('src/main/resources/templates/books.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('books.html patched')

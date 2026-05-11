import sys

with open('src/main/resources/templates/cart.html', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''                            <!-- ✅ Remove with confirmation -->
                            <a th:href="@{/remove/{id}(id=${c.id})}" class="btn-remove"
                                onclick="return confirm('🗑️ Are you sure you want to remove \\'' + this.closest('tr').querySelector('h5').textContent + '\\' from your cart?');">'''

replacement1 = '''                            <!-- ✅ Remove with confirmation -->
                            <a th:href="@{/remove/{id}(id=${c.id})}" class="btn-remove">'''

target2 = '''                                        <i class="fas fa-tag"></i>
                                        <span th:text="'ID: ' + ${c.id}">ID: 1</span>'''

replacement2 = '''                                        <i class="fas fa-tag"></i>
                                        <span th:text="'ID: ' + ${c.bookId}">ID: 1</span>'''

target3 = '''                } else {
                    // Show loading state
                    const originalText = this.innerHTML;
                    this.innerHTML = '<span class="loading-spinner"></span> Removing...';
                    this.disabled = true;

                    // The actual removal will happen via the link navigation
                    // This is just visual feedback
                }'''

replacement3 = '''                } else {
                    // Show loading state
                    this.style.opacity = '0.7';
                    this.style.pointerEvents = 'none';
                }'''

target4 = '''        // Show tooltip for keyboard shortcuts
        console.log('💡 Tip: Use Ctrl+B to go back to books, Ctrl+C for checkout');'''

replacement4 = '''        // Show tooltip for keyboard shortcuts
        console.log('💡 Tip: Use Ctrl+B to go back to books, Ctrl+C for checkout');
        
        // Checkout spinner
        document.querySelector('.btn-checkout')?.addEventListener('click', function(e) {
            const spinner = document.getElementById('checkoutSpinner');
            if (spinner) {
                spinner.style.display = 'inline-block';
                this.style.pointerEvents = 'none';
                this.style.opacity = '0.8';
            }
        });'''

content = content.replace(target1, replacement1).replace(target2, replacement2).replace(target3, replacement3).replace(target4, replacement4)

with open('src/main/resources/templates/cart.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('cart.html patched')

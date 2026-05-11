import sys

with open('src/main/java/com/bookstore/bookstore/service/AuthService.java', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    public Optional<AppUser> findByContact(String contact) {
        return userRepository.findByContact(contact);
    }'''

replacement = '''    public Optional<AppUser> findById(int id) {
        return userRepository.findById(id);
    }

    public Optional<AppUser> findByContact(String contact) {
        return userRepository.findByContact(contact);
    }'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/main/java/com/bookstore/bookstore/service/AuthService.java', 'w', encoding='utf-8') as f:
        f.write(content)
    print('AuthService patched successfully')
else:
    print('AuthService target not found')

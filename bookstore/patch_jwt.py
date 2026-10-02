import sys

with open('src/main/java/com/bookstore/bookstore/service/JwtService.java', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;'''

replacement1 = '''import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;'''

target2 = '''    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}'''

replacement2 = '''    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, AppUser user) {
        final String userId = extractAllClaims(token).getSubject();
        return (userId.equals(String.valueOf(user.getId())) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}'''

content = content.replace(target1, replacement1).replace(target2, replacement2)

with open('src/main/java/com/bookstore/bookstore/service/JwtService.java', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/main/java/com/bookstore/bookstore/service/AuthService.java', 'r', encoding='utf-8') as f:
    auth_content = f.read()

auth_target = '''    public Optional<AppUser> findByContact(String contact) {
        return appUserRepository.findByContact(contact);
    }'''

auth_replacement = '''    public Optional<AppUser> findById(int id) {
        return appUserRepository.findById(id);
    }

    public Optional<AppUser> findByContact(String contact) {
        return appUserRepository.findByContact(contact);
    }'''

if auth_target in auth_content:
    auth_content = auth_content.replace(auth_target, auth_replacement)
    with open('src/main/java/com/bookstore/bookstore/service/AuthService.java', 'w', encoding='utf-8') as f:
        f.write(auth_content)
else:
    print('AuthService target not found')

print('Patched successfully')

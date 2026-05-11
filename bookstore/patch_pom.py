import sys

with open('pom.xml', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = '''		<!-- Thymeleaf -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-thymeleaf</artifactId>
		</dependency>'''

replacement1 = '''		<!-- Spring Security -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<!-- Validation -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-validation</artifactId>
		</dependency>'''

content = content.replace(target1, replacement1)

with open('pom.xml', 'w', encoding='utf-8') as f:
    f.write(content)
print('pom.xml patched')

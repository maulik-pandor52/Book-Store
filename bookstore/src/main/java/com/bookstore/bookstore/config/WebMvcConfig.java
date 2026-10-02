package com.bookstore.bookstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final LoginInterceptor loginInterceptor;

    public WebMvcConfig(LoginInterceptor loginInterceptor) {
        this.loginInterceptor = loginInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns(
                        "/",
                        "/books",
                        "/add-book",
                        "/save",
                        "/delete/**",
                        "/cart",
                        "/cart/**",
                        "/remove/**",
                        "/checkout",
                        "/payment-success")
                .excludePathPatterns(
                        "/login",
                        "/register",
                        "/verify-otp",
                        "/logout",
                        "/api/otp/**",
                        "/error");
    }
}

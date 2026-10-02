package com.bookstore.bookstore.exception;

import com.bookstore.bookstore.dto.OtpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(OtpException.class)
    public ResponseEntity<OtpResponse> handleOtpException(OtpException ex) {
        return ResponseEntity.badRequest().body(new OtpResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<OtpResponse> handleException(Exception ex) {
        LOGGER.error("Unhandled application error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new OtpResponse(false, "Something went wrong. Please try again."));
    }
}

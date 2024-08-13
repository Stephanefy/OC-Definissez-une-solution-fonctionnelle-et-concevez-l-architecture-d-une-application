package com.stephanefy.ycyw_chat.utils;

import com.stephanefy.ycyw_chat.domain.User;
import com.stephanefy.ycyw_chat.services.CustomUserDetailsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CustomUserDetailsService userDetailsService;

    public DataInitializer(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) throws Exception {
        User user1 = new User();
        user1.setUsername("Bob");
        user1.setRole(User.Role.CLIENT);
        user1.setPassword(passwordEncoder().encode("password"));
        user1.setEnabled(true);

        User user2 = new User();
        user2.setUsername("Alice");
        user2.setRole(User.Role.CLIENT);
        user2.setPassword(passwordEncoder().encode("password"));
        user2.setEnabled(true);

        User user3 = new User();
        user3.setUsername("Steve");
        user3.setRole(User.Role.SUPPORT);
        user3.setPassword(passwordEncoder().encode("password"));
        user3.setEnabled(true);

        userDetailsService.saveUser(user1);
        userDetailsService.saveUser(user2);
        userDetailsService.saveUser(user3);

    }
}
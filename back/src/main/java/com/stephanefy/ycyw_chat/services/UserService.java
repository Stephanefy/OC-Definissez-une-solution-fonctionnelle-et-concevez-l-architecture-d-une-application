package com.stephanefy.ycyw_chat.services;

import com.stephanefy.ycyw_chat.domain.User;
import com.stephanefy.ycyw_chat.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;


    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getSupportDetails() {
        return userRepository.findSupportDetails();
    }
}

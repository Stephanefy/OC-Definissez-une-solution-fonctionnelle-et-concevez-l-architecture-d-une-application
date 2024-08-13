package com.stephanefy.ycyw_chat.controllers;


import com.stephanefy.ycyw_chat.domain.User;
import com.stephanefy.ycyw_chat.dtos.LoginRequest;
import com.stephanefy.ycyw_chat.dtos.LoginResponse;
import com.stephanefy.ycyw_chat.dtos.OnlineUserDto;
import com.stephanefy.ycyw_chat.services.CustomUserDetailsService;
import com.stephanefy.ycyw_chat.services.UserService;
import com.stephanefy.ycyw_chat.utils.Mapper;
import com.stephanefy.ycyw_chat.websocket.WebSocketEventListener;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;


@Log4j2
@RestController
@RequestMapping("/auth")
public class AuthController {

    private AuthenticationManager authenticationManager;

    private CustomUserDetailsService customUserDetailsService;

    private WebSocketEventListener webSocketEventListener;

    @Autowired
    private UserService userService;

    public AuthController(AuthenticationManager authenticationManager, CustomUserDetailsService customUserDetailsService, WebSocketEventListener webSocketEventListener) {
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.webSocketEventListener = webSocketEventListener;
    }

    @PostMapping("/login")
    public ResponseEntity<?>  login(@RequestBody LoginRequest request) throws Exception {


        List<OnlineUserDto> offlineUsers = Mapper.mapperList(userService.getAllUsers(),OnlineUserDto.class);


        offlineUsers.stream()
                .filter(u -> u.getUsername().equals(request.getUsername()))
                .map(u -> {
                    u.setStatus("ONLINE");
                    return u;
                })
                .collect(Collectors.toList());


        try {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            );
            Authentication authentication = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails foundUser = (UserDetails) authentication.getPrincipal();
            LoginResponse response = Mapper.mapperObject(foundUser, LoginResponse.class);
            return new ResponseEntity<LoginResponse>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new Exception("Invalid username or password");
        }
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest request) throws Exception {
        try {

            User foundUser = (User) customUserDetailsService.loadUserByUsername(request.getUsername());
            if(foundUser != null && foundUser.getRole() == User.Role.SUPPORT){

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                );
                Authentication authentication = authenticationManager.authenticate(authToken);
                SecurityContextHolder.getContext().setAuthentication(authentication);

                LoginResponse response = Mapper.mapperObject(foundUser, LoginResponse.class);

                return new ResponseEntity<LoginResponse>(response, HttpStatus.OK);
            }


            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);


        } catch (Exception e) {
            throw new Exception(e);
        }
    }
}

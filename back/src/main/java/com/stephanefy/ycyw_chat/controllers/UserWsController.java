package com.stephanefy.ycyw_chat.controllers;

import com.stephanefy.ycyw_chat.domain.User;
import com.stephanefy.ycyw_chat.dtos.OnlineUserDto;
import com.stephanefy.ycyw_chat.exceptions.InternalException;
import com.stephanefy.ycyw_chat.services.MessageService;
import com.stephanefy.ycyw_chat.services.UserService;
import com.stephanefy.ycyw_chat.utils.Mapper;
import com.stephanefy.ycyw_chat.websocket.WebSocketEventListener;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@RestController
@RequestMapping("/chat/users")
public class UserWsController {
    @Autowired
    WebSocketEventListener webSocketEventListener;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    /* Temporary solution for fetching support id */
    @GetMapping("/support-details")
    public ResponseEntity<User> getSupportDetails() {
        return ResponseEntity.ok(userService.getSupportDetails());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }


    @GetMapping("/{currentUserId}")
    public ResponseEntity<Set<OnlineUserDto>> getOnlineUsers(@PathVariable String currentUserId) {
        List<OnlineUserDto> usersWithStatus = new ArrayList<>();

        List<OnlineUserDto>offlineUsers = Mapper.mapperList(userService.getAllUsers(),OnlineUserDto.class);


        offlineUsers.stream().map(u->{
            u.setRole(u.getRole());
            u.setStatus("OFFLINE");
            return u;
        }).collect(Collectors.toList());

        try{
            Set<OnlineUserDto> onlsSet = webSocketEventListener.getConnectedUsers();



            if(onlsSet!=null){
                List<OnlineUserDto>onlines = onlsSet.stream().collect(Collectors.toList());
                onlines.forEach(o->{
                    int count = messageService.countNewMessagesFromOnlineUser(currentUserId, o.getUserId());
                    o.setNoOfNewMessages(count);
                    o.setStatus("ONLINE");
                });
                usersWithStatus.addAll(onlines);
                List<OnlineUserDto> finalOnls = onlines;
                offlineUsers.forEach(u->{
                    if(finalOnls.stream().map(OnlineUserDto::getUsername).collect(Collectors.toList()).contains(u.getUsername())==false){
                        usersWithStatus.add(u);
                    }
                });
            }
            else{
                usersWithStatus.addAll(offlineUsers);
            }

        }
        catch(Exception ex){
            throw new InternalException("Cannot get the number of online users");
        }

        Set<OnlineUserDto> usersWithStatusSet = usersWithStatus.stream().collect(Collectors.toSet());
        return ResponseEntity.ok(usersWithStatusSet);
    }
}
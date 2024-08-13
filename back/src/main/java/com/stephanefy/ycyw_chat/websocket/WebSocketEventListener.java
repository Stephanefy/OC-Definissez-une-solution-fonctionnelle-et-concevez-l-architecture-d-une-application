package com.stephanefy.ycyw_chat.websocket;

import com.stephanefy.ycyw_chat.domain.User;
import com.stephanefy.ycyw_chat.dtos.OnlineUserDto;
import com.stephanefy.ycyw_chat.repositories.UserRepository;
import com.stephanefy.ycyw_chat.services.MessageService;
import com.stephanefy.ycyw_chat.utils.Mapper;
import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import java.util.*;


@Log4j2
@Component
@Data
public class WebSocketEventListener {

    private Set<OnlineUserDto> connectedUsers;


    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {

        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        @SuppressWarnings("rawtypes")
        GenericMessage connectHeader = (GenericMessage) stompAccessor
                .getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
        // to the server
        @SuppressWarnings("unchecked")
        Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) connectHeader.getHeaders()
                .get(SimpMessageHeaderAccessor.NATIVE_HEADERS);
        log.info("nativeHeaders {}", nativeHeaders);
        String login = nativeHeaders.get("login").get(0);
        String sessionId = stompAccessor.getSessionId();
        if(this.connectedUsers==null){
            this.connectedUsers = new HashSet<>();
        }
        log.info("{}",login);
        User usr = userRepository.findByUsername(login);
        log.info("userInfo {}", usr);
        if(usr != null){
            OnlineUserDto onl = Mapper.mapperObject(usr, OnlineUserDto.class);
            onl.setSessionId(sessionId);
            this.connectedUsers.add(onl);
        }
    }
}
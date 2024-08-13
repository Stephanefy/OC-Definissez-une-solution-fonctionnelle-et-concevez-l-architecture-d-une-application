package com.stephanefy.ycyw_chat.websocket;

import lombok.extern.log4j.Log4j2;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Log4j2
public class CustomWebSocketHandler extends TextWebSocketHandler {



    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
// Perform actions when a new WebSocket connection is established
        log.info("current session {}", session);
    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
// Perform actions when a WebSocket connection is closed
    }


}

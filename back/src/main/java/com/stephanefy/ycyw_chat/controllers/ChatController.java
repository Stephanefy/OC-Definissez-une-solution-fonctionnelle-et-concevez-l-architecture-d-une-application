package com.stephanefy.ycyw_chat.controllers;


import com.stephanefy.ycyw_chat.domain.ChatSession;
import com.stephanefy.ycyw_chat.domain.Message;
import com.stephanefy.ycyw_chat.domain.User;
import com.stephanefy.ycyw_chat.exceptions.InternalException;
import com.stephanefy.ycyw_chat.repositories.ChatSessionRepository;
import com.stephanefy.ycyw_chat.repositories.MessageRepository;
import com.stephanefy.ycyw_chat.services.CustomUserDetailsService;
import com.stephanefy.ycyw_chat.services.MessageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Log4j2
@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate template;

    private final List<Message> messages;
    private MessageService messageService;
    private ChatSessionRepository chatSessionRepository;
    private MessageRepository messageRepository;
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    public ChatController(MessageService messageService, ChatSessionRepository chatSessionRepository, MessageRepository messageRepository, CustomUserDetailsService customUserDetailsService) {
        this.messages = new ArrayList<>();
        this.messageService = messageService;
        this.chatSessionRepository = chatSessionRepository;
        this.messageRepository = messageRepository;
        this.customUserDetailsService = customUserDetailsService;
    }

    @MessageMapping("/new-request")
//    @SendTo("/support-tickets/added-tickets")
    public Message sendMessage(@RequestBody  Message chatMessage, SimpMessageHeaderAccessor headerAccessor) throws InterruptedException {
        String sessionId = headerAccessor.getSessionId();

        messageService.saveMessage(chatMessage);
        Thread.sleep(1000);  // Simulated delay

        headerAccessor.setSessionId(sessionId);

        Optional<ChatSession> chatSession = chatSessionRepository.findChatroomBySenderIdAndRecipientId(chatMessage.getSenderId(), chatMessage.getReceiverId());
        String chatSessionId = "";
        if (chatSession.isEmpty()) {
            chatSessionId = String.format("%s_%s", chatMessage.getSenderId(), chatMessage.getReceiverId());

            ChatSession senderRecipient = ChatSession
                    .builder()
                    .chatSessionId(chatSessionId)
                    .senderId(chatMessage.getSenderId())
                    .senderName(chatMessage.getSenderName())
                    .receiverId(chatMessage.getReceiverId())
                    .build();

            ChatSession recipientSender = ChatSession
                    .builder()
                    .chatSessionId(chatSessionId)
                    .senderId(chatMessage.getReceiverId())
                    .senderName(chatMessage.getSenderName())
                    .receiverId(chatMessage.getSenderId())
                    .build();
            try {
                chatSessionRepository.save(senderRecipient);
                chatSessionRepository.save(recipientSender);
            } catch (Exception ex) {
                ex.printStackTrace();
                throw new InternalException("Cannot create new chat room between sender " + chatMessage.getSenderId() + " and recipient " + chatMessage.getReceiverId());
            }

        } else {
            chatSessionId = chatSession.get().getChatSessionId();
        }
        chatMessage.setChatSessionId(chatSessionId);
        Message saved = null;
        try {
            User user = (User) customUserDetailsService.loadUserByUsername(chatMessage.getSenderName());

            boolean isFromClient = user.getRole() == (User.Role.CLIENT) ? true : false;

            chatMessage.setFromClient(isFromClient);
            saved = messageRepository.save(chatMessage);
        } catch (Exception ex) {
            throw new InternalException("Cannot create new message in chatroomId {}" + chatSessionId + ex);
        }


          messagingTemplate.convertAndSendToUser(chatMessage.getReceiverName(), "/support-tickets/added-tickets", chatMessage);


        return chatMessage;
    }

    @SubscribeMapping("/support-tickets/added-tickets")
    public ArrayList<Message> loadMessage() {

       return messageService.getMessages();
    }

}

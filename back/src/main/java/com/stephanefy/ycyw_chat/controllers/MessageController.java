package com.stephanefy.ycyw_chat.controllers;

import com.stephanefy.ycyw_chat.domain.ChatSession;
import com.stephanefy.ycyw_chat.domain.Message;
import com.stephanefy.ycyw_chat.exceptions.InternalException;
import com.stephanefy.ycyw_chat.services.ChatSessionService;
import com.stephanefy.ycyw_chat.services.MessageService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Log4j2
@RestController
@RequestMapping("/chat/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @Autowired
    private ChatSessionService chatSessionService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @GetMapping("/clients-requests")
    public ResponseEntity<?> getClientRequests() {
        List<Message> messagesFromClients = null;

        try {
            messagesFromClients = messageService.findAllClientChatMessages();

            return new ResponseEntity<List<Message>>(messagesFromClients, HttpStatus.OK);
        } catch(Exception ex) {

            return new ResponseEntity<>(messagesFromClients, HttpStatus.NOT_FOUND);

        }
    }

    @GetMapping("/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getChatMessages(@PathVariable String senderId,
                                                         @PathVariable String receiverId) {
        List<Message>messagesFromSenderRepicient = null;
        try{
            List<Message> messages = messageService.findChatMessagesFromSelectedUser(senderId, receiverId);



            ChatSession chatSession = chatSessionService.findChatroomBySenderIdAndRecipientId(senderId, receiverId);

            if(chatSession!=null){
                messagesFromSenderRepicient = messageService.findChatMessagesByChatSessionId(chatSession.getChatSessionId());
            }
        }
        catch(Exception ex){
            ex.printStackTrace();
            throw new InternalException("Cannot find messages between sender "+senderId+" and recipient "+receiverId);
        }
        return new ResponseEntity<List<Message>>(messagesFromSenderRepicient, HttpStatus.OK);
    }

    @GetMapping("/{receiverId}")
    public ResponseEntity<?> getAllRelatedChatSessions(@PathVariable String receiverId) {
        List<ChatSession>allRelatedChatSessions = null;


        try {
            allRelatedChatSessions = chatSessionService.findChatroomByRecipientId(receiverId);


        } catch(Exception ex){

            throw new InternalException("Cannot find messages for this "+ receiverId);


        }
        Set<String> seenSenderName = new HashSet<>();
        List<ChatSession> uniqueChatSessions = allRelatedChatSessions.stream()
                .filter(chatSession -> seenSenderName.add(chatSession.getSenderName()))
                .collect(Collectors.toList());

        return new ResponseEntity<List<ChatSession>>(uniqueChatSessions, HttpStatus.OK);
    }



}

package com.stephanefy.ycyw_chat.services;

import com.stephanefy.ycyw_chat.domain.Message;
import com.stephanefy.ycyw_chat.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {


    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final List<Message> messages;

    public MessageService() {
        this.messages = new ArrayList<>();
    }

    public void saveMessage(Message message) {
        messages.add(message);
    }

    public void loadMessage() {
        for (Message message : messages) {
            messagingTemplate.convertAndSend( "/support-tickets/added-tickets", message);
        }
    }

    public ArrayList<Message> getMessages() {
        return new ArrayList<Message>(messages);
    }

    public List<Message> findChatMessagesByChatSessionId(String chatroomId){
        return messageRepository.findChatMessagesByChatroomId(chatroomId);
    }

    public List<Message> findAllClientChatMessages() {
        return messageRepository.findChatMessagesByClients();
    }

    public int countNewMessagesFromOnlineUser(String currentUserId, String userId){
        return messageRepository.countNewMessagesFromOnlineUser(currentUserId, userId);
    }

    public List<Message>findChatMessagesFromSelectedUser(String senderId, String recipientId){
        return messageRepository.findChatMessagesFromSelectedUser(senderId, recipientId);
    }
}
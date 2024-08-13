package com.stephanefy.ycyw_chat.services;


import com.stephanefy.ycyw_chat.domain.ChatSession;
import com.stephanefy.ycyw_chat.repositories.ChatSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatSessionService {

    @Autowired
    ChatSessionRepository chatSessionRepository;


    public ChatSession findChatroomBySenderIdAndRecipientId(String senderId, String recipientId){
        Optional<ChatSession> found = chatSessionRepository.findChatroomBySenderIdAndRecipientId(senderId, recipientId);
        if (found.isPresent()){
            return found.get();
        }
        return null;
    }

    public List<ChatSession> findChatroomByRecipientId(String recipientId) {
        Optional<List<ChatSession>> foundList = chatSessionRepository.findChatroomRecipientId(recipientId);

        if (foundList.isPresent()){
            return foundList.get();
        }
        return null;
    }
}

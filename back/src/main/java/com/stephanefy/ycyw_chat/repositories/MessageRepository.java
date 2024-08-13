package com.stephanefy.ycyw_chat.repositories;

import com.stephanefy.ycyw_chat.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    @Query("FROM Message m WHERE m.senderId = :senderId AND m.receiverId = :receiverId")
    List<Message> findChatMessagesFromSelectedUser(String senderId, String receiverId);

    @Query("FROM Message m WHERE m.chatSessionId = :chatSessionId")
    List<Message> findChatMessagesByChatroomId(String chatSessionId);

    @Query("FROM Message m WHERE m.fromClient = true")
    List<Message> findChatMessagesByClients();

    @Query("SELECT COUNT(*) FROM Message m WHERE m.receiverId = :currentUserId AND m.senderId = :onlineUserId")
    int countNewMessagesFromOnlineUser(String currentUserId, String onlineUserId);


}

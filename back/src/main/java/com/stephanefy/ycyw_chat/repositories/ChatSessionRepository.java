package com.stephanefy.ycyw_chat.repositories;

import com.stephanefy.ycyw_chat.domain.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Integer> {
    @Query("FROM ChatSession c WHERE c.senderId = :senderId AND c.receiverId = :receiverId")
    Optional<ChatSession> findChatroomBySenderIdAndRecipientId(String senderId, String receiverId);

    @Query("FROM ChatSession c WHERE c.receiverId = :receiverId")
    Optional<List<ChatSession>> findChatroomRecipientId(String receiverId);
}

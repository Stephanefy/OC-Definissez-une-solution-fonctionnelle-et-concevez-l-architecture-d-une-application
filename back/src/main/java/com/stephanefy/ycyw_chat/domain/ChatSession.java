package com.stephanefy.ycyw_chat.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "session_id")
    private String chatSessionId;

    @Column(name = "sender_id")
    private String senderId;

    @Column(name="sender_name")
    private String senderName;

    @Column(name= "receiver_id")
    private String receiverId;

}

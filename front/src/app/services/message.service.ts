import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient) { }


  getClientMessages(): Observable<Message[]>{
    return this.httpClient.get<Message[]>('http://localhost:8080/chat/messages/clients-requests');
  }

  getChatMessages(senderId: string, recipientId: string): Observable<Message[]>{
    return this.httpClient.get<Message[]>(`http://localhost:8080/chat/messages/${senderId}/${recipientId}`);
  }

  getRelatedChatSessions(receiverId: string) : Observable<any[]>{
    return this.httpClient.get<any[]>(`http://localhost:8080/chat/messages/${receiverId}`);
  }

  getOnlineUsers(currentUserId: string): Observable<any[]>{
    return this.httpClient.get<any[]>(`http://localhost:8080/chat/users/${currentUserId}`);
  }
}

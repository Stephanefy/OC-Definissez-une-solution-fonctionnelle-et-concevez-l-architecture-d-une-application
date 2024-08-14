import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { UserDetails } from '../../models/UserDetails';
import { Message } from '../../models/Message';
import { CommonModule } from '@angular/common';
import { removeDuplicatesById } from '../../utils/removeDuplicates';
import { Router, RouterModule } from '@angular/router';
import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';
import { RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private onlineUsersSubscription!: Subscription;

  onlineUsers: any[] = [];
  clientMessages: Message[] = [];
  currentUser: UserDetails | null = null;

  newMessages: Message[] = [];
  currentMessages: any[] = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private stateService: StateService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.onlineUsersSubscription = this.stateService.onlineUsers$.subscribe(
      (users) => {
        this.onlineUsers = users;
      }
    );
    // console.log('fds', this.onlineUsers)
    // this.currentMessages = JSON.parse(localStorage.getItem("currentMessages") || '{}')

    this.messageService
      .getOnlineUsers(this.currentUser!.id)
      .subscribe((users) => {
        console.log('users', users);
        // console.log("list of connected users" ,uniqueUsers);
        this.onlineUsers = [...users];
      });

    this.messageService
      .getRelatedChatSessions(this.currentUser!.id)
      .subscribe((sessions) => {
        console.log(sessions);
        this.currentMessages = [...sessions];
      });

    this.webSocketService
      .getClient()!
      .watch(
        `/support-tickets/${this.currentUser?.username}/support-tickets/added-tickets`
      )
      .subscribe((response: any) => {
        this.newMessages.push(JSON.parse(response.body));

        console.log('test', this.newMessages);
      });
  }

  navigateToChatBoard(username: string, senderId: string) {
    const navigationData = {
      username,
      senderId,
    };
    this.stateService.setReceiverName(username);
    this.stateService.setReceiverId(senderId);
    this.router.navigate(['/chat-board'], {
      state: { data: navigationData },
    });
  }
}

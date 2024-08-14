import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Message } from '../../models/Message';
import { WebsocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../../models/UserDetails';
import { nanoid } from 'nanoid';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { concatMap, map, Observable, Subscription, tap } from 'rxjs';
import { StateService } from '../../services/state.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'chat-board',
  templateUrl: './chat-board.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
})
export class ChatBoardComponent implements OnInit {
  title = 'your-car-your-way support';

  currentUser: UserDetails | null = null;
  currentSupportId!: string;
  sessionData: { username: string; senderId: string } = {
    username: '',
    senderId: '',
  };
  receiverId: string = '';
  receiverName!: string;

  messages: Message[] = [];
  subscription!: Subscription;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  form: FormGroup = new FormGroup({
    // title: new FormControl<string>('', Validators.required),
    content: new FormControl<string>('', Validators.required),
  });

  constructor(
    private webSocketService: WebsocketService,
    // private rxStompService : RxStompService,
    private messageService: MessageService,
    private stateService: StateService,
    private userService: UserService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation()?.extras?.state;

    this.sessionData.username = navigation?.['data']?.['username'];
    this.sessionData.senderId = navigation?.['data']?.['senderId'];
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // First, fetch the support details
    this.userService
      .getSupportDetails()
      .pipe(
        map((res) => {
          this.currentSupportId = res.id;
        }),
        concatMap(() => {
          this.currentUser = JSON.parse(
            localStorage.getItem('currentUser') || '{}'
          );
          return this.messageService.getChatMessages(
            this.currentUser!.id,
            this.sessionData.senderId
          );
        }),
        map((chatMessages) => {
          if (chatMessages) {
            this.messages = chatMessages;
          }
        }),
        concatMap(() => {
          return this.messageService.getChatMessages(
            this.currentSupportId,
            this.sessionData.senderId
          );
        })
      )
      .subscribe((chatMessages) => {
        if (chatMessages) {
          this.messages = chatMessages;
        }
      });

    this.subscription = this.stateService.receiverName$.subscribe((name) => {
      this.receiverName = name;
    });

    this.webSocketService
      .getClient()!
      .watch(
        `/support-tickets/${this.currentUser?.username}/support-tickets/added-tickets`
      )
      .subscribe((message: any) => {
        const realTimeMessage = JSON.parse(message.body);

        if (realTimeMessage.senderName === this.sessionData.username) {
          this.messages.push(realTimeMessage);
        }
      });
  }

  publishMessage(content: string): void {
    if (this.currentUser!.role === 'SUPPORT') {
      this.receiverId = this.sessionData.senderId;
      this.receiverName = this.sessionData.username;
    } else {
      this.receiverId = this.currentSupportId;
      this.receiverName = 'Steve';
    }

    const message: Message = {
      id: nanoid(),
      title: content.slice(0, 10),
      senderId: this.currentUser!.id,
      receiverId: this.receiverId,
      content: content,
      senderName: this.currentUser!.username,
      receiverName: this.receiverName,
      createdOn: new Date(),
    };
    this.webSocketService.getClient()!.publish({
      destination: '/support-dashboard/new-request',
      body: JSON.stringify(message),
    });

    this.messages.push(message);
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach((key) => {
      const controlErrors = this.form.controls[key].errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' +
              key +
              ', keyError: ' +
              keyError +
              ', error value: ',
            controlErrors[keyError]
          );
        });
      }
    });
  }

  sendMessage(): void {
    if (this.form.controls['content'].status === 'VALID') {
      this.publishMessage(this.form.value.content);
    }
    this.getFormValidationErrors();
    this.form.reset({});
  }
}

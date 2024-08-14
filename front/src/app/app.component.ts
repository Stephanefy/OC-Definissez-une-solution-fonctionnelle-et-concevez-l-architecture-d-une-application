import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from './models/Message';
import { WebsocketService } from './services/websocket.service';
import { CommonModule } from '@angular/common';
import { RxStompService } from './services/rx-stomp.service';
import { ChatBoardComponent } from './components/chat-board/chat-board.component';
import { LoginChatFormComponent } from './components/login-chat-form/login-chat-form.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [{
    provide: RxStompService,
  }],
  imports: [ReactiveFormsModule, CommonModule, ChatBoardComponent, LoginChatFormComponent, RouterModule, NavbarComponent],
  standalone: true,
})
export class AppComponent implements OnInit{

  title = 'Your-Car-Your-Way support';



  constructor(private webSocketService: WebsocketService, private rxStompService : RxStompService) {
  }

  ngOnInit(): void {
    console.log("test")
  }


}
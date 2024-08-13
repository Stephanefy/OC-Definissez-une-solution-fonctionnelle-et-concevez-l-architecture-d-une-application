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

  // messages: Message[] = [];

  // form: FormGroup = new FormGroup({
  //   title: new FormControl<string>('', Validators.required),
  //   content: new FormControl<string>("what is your issue ?" , Validators.required)
  // });

  constructor(private webSocketService: WebsocketService, private rxStompService : RxStompService) {
  }

  ngOnInit(): void {
    console.log("test")
    // console.log("fklsfklsdkl")
    // // this.webSocketService.listen(message => {
    // //   console.log("message coming from listener",message)
    // //   this.messages.push(message);
    // // });
    // //@ts-ignore
    // this.rxStompService.watch('/support-tickets/added-tickets').subscribe((message: Message) => {
    //   //@ts-ignore
    //   console.log(message.body)
    //   //@ts-ignore
    //   this.messages.push(JSON.parse(message.body));
    //   console.log(this.messages)
    // });
  }


}
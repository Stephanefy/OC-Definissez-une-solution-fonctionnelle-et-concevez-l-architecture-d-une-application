import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Role } from './roles';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../../services/authservice.service';
import { HttpClientModule } from '@angular/common/http';
import { StateService } from '../../services/state.service';
import { Router } from '@angular/router';
import { UserDetails } from '../../models/UserDetails';

@Component({
  selector: 'app-login-chat-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-chat-form.component.html',
  styleUrl: './login-chat-form.component.scss',
})
export class LoginChatFormComponent implements OnInit {
  roles = [Role.CUSTOMER, Role.SUPPORT];

  currentUser: UserDetails | null = null;

  loginForm: FormGroup;
  authStatus!: boolean;

  showSupportIdInput: boolean = false;

  constructor(private authService: AuthserviceService, private stateService: StateService, private router: Router) {
    console.log(this.roles);
    this.loginForm = new FormGroup({
      username: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
      role: new FormControl<Role>(Role.CUSTOMER, Validators.required),
      supportId: new FormControl<string>('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.loginForm.valueChanges.subscribe((value) => {
      if (value.role === 'support') {
        this.showSupportIdInput = true;
      } else {
        this.showSupportIdInput = false;
      }
    });

    this.authService.currentAuthStatus$.subscribe(
      (authStatus) => (this.authStatus = authStatus))
  }

  login(username: string, senderId: string): void {
    console.log("reached")
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (response) => {
        console.log("response from login call",response);
        const navigationData = {
          username: response.username,
          senderId: response.id,
        }
        console.log("from login",navigationData)
        this.stateService.setReceiverName(username);
        this.stateService.setReceiverId(senderId);

        console.log("when loggin in",navigationData)

        this.router.navigate(['/chat-board'], {
          state: { data: navigationData },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  navigateToChatBoard(username: string, senderId: string) {
    const navigationData = {
      username,
      senderId,
    }
    this.stateService.setReceiverName(username);
    this.stateService.setReceiverId(senderId);
    this.router.navigate(['/chat-board'], {
      state: { data: navigationData },
    });
  }
}

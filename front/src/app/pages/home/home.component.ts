import { Component, OnInit } from '@angular/core';
import { LoginChatFormComponent } from '../../components/login-chat-form/login-chat-form.component';
import { StateService } from '../../services/state.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoginAdminFormComponent } from '../../components/login-admin-form/login-admin-form.component';
import { AuthserviceService } from '../../services/authservice.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginChatFormComponent, CommonModule, LoginAdminFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {


  title = 'Your-Car-Your-Way support';
  
  isAdmin: boolean = false;
  currentAuthStatus:boolean = false;


  constructor(private stateService: StateService, private authService: AuthserviceService) {

  }

  ngOnInit(): void {
    this.stateService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    this.authService.currentAuthStatus$.subscribe((authStatus) => {
      this.currentAuthStatus = authStatus;
    });

    console.log(this.currentAuthStatus);
  }

}

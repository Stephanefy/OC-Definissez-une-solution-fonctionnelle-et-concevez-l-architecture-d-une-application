import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthserviceService } from '../../services/authservice.service';
import { UserDetails } from '../../models/UserDetails';
import { RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { WebsocketService } from '../../services/websocket.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  onlineUsers: any[] = [];
  currentAuthStatus!: boolean;
  currentUser: UserDetails | null = null;
  logo: string = 'assets/images/ycyw.png';
  isAdmin: boolean = false;
  isOpen: boolean = false;

  constructor(
    private stateService: StateService,
    private authService: AuthserviceService,
    private router: Router,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentAuthStatus().subscribe((authStatus) => {
      this.currentAuthStatus = authStatus;
    });

    this.stateService.onlineUsers$.subscribe((users) => {
      this.onlineUsers = users;
    });

    this.stateService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  toAdmin(): void {
    console.log(this.stateService.getisAdminData());
    this.isOpen = false;
    this.stateService.setIsAdmin(true);
  }

  toClient(): void {
    console.log(this.stateService.getisAdminData());
    this.isOpen = false;
    this.stateService.setIsAdmin(false);
  }

  toHome() {
    this.isOpen = false;

    if (this.isAdmin) {
      this.router.navigate(['/admin-board']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    // const currentRxStompService =  this.webSocketService.getClient();

    // currentRxStompService?.deactivate()

    this.authService.logout();
  }

  openMenu(): void {
    this.isOpen = !this.isOpen;
  }
}

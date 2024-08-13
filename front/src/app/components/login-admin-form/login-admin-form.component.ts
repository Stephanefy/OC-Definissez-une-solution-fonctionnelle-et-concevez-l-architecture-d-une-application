import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-admin-form.component.html',
  styleUrl: './login-admin-form.component.scss'
})
export class LoginAdminFormComponent {

  loginForm: FormGroup;

  constructor(private authService: AuthserviceService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
    });
  }



  login(): void {
    this.authService.adminLogin(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(["/admin-board"]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}

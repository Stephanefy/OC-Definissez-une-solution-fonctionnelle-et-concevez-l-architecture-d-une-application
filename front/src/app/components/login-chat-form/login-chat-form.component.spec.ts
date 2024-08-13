import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginChatFormComponent } from './login-chat-form.component';

describe('LoginChatFormComponent', () => {
  let component: LoginChatFormComponent;
  let fixture: ComponentFixture<LoginChatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginChatFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginChatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAdminFormComponent } from './login-admin-form.component';

describe('LoginAdminFormComponent', () => {
  let component: LoginAdminFormComponent;
  let fixture: ComponentFixture<LoginAdminFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAdminFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';

describe.only('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let accountServiceMock: any;
  let activatedRouteMock: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    accountServiceMock = {
      login: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      declarations: [LoginComponent, TextInputComponent],
      providers: [
        {
          provide: AccountService,
          useValue: accountServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/shop' },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRouteMock = TestBed.inject(ActivatedRoute); // Inject ActivatedRoute
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call accountService.login when the form is submitted', () => {
  //   const loginForm = component.loginForm;
  //   loginForm.controls.email.setValue('test@example.com');
  //   loginForm.controls.password.setValue('password');

  //   const submitButton = fixture.debugElement.query(
  //     By.css('button[type="submit"]')
  //   );
  //   submitButton.triggerEventHandler('click', null);

  //   fixture.detectChanges();

  //   expect(accountServiceMock.login).toHaveBeenCalledWith({
  //     email: 'test@example.com',
  //     password: 'password',
  //   });
  // });
});

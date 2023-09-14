import { render, screen, waitFor } from '@testing-library/angular';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../account.service';
import userEvent from '@testing-library/user-event';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ShopComponent } from 'src/app/shop/shop.component';
import { TestBed } from '@angular/core/testing';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';

describe('Register Component', () => {
  let accountServiceMock: any = {};
  let router: Router;
  let user: UserEvent;

  beforeEach(async () => {
    user = userEvent.setup();
    accountServiceMock = {
      register: jest.fn(),
      checkEmailExists: jest.fn(),
    };

    await render(RegisterComponent, {
      declarations: [TextInputComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'shop', component: ShopComponent },
        ]),
      ],
      providers: [
        { provide: AccountService, useValue: accountServiceMock },
        { provide: FormBuilder, useValue: new FormBuilder() },
      ],
    });

    router = TestBed.inject(Router);
  });

  describe('Layout', () => {
    it(' create', () => {
      expect(screen.getByTestId('register-form-container')).toBeTruthy();
    });

    it('has Sign up header', () => {
      expect(
        screen.getByRole('heading', { name: 'Sign up' })
      ).toBeInTheDocument();
    });

    it('has display name input', () => {
      expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    });

    it('has text type for display name input', () => {
      expect(screen.getByLabelText('Display Name')).toHaveAttribute(
        'type',
        'text'
      );
    });

    it('has email input', () => {
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('has email type for email input', () => {
      expect(screen.getByLabelText('Email Address')).toHaveAttribute(
        'type',
        'email'
      );
    });

    it('has password input', () => {
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('has password type for password input', async () => {
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password'
      );
    });

    it('has repeat password input', () => {
      expect(screen.getByLabelText('Repeat Password')).toBeInTheDocument();
    });

    it('has password type for repeat password input', async () => {
      expect(screen.getByLabelText('Repeat Password')).toHaveAttribute(
        'type',
        'password'
      );
    });

    it('has Sign up button', () => {
      expect(
        screen.getByRole('button', { name: 'Sign up' })
      ).toBeInTheDocument();
    });

    it('disable the Sign Up button initially', () => {
      const button = screen.getByRole('button', { name: 'Sign up' });
      expect(button).toBeDisabled();
    });
  });

  describe('Iteractions', () => {
    let button: any;
    let displayName: any;
    let email: any;
    let password: any;
    let repeatPassword: any;
    const setupForm = async () => {
      jest
        .spyOn(accountServiceMock, 'checkEmailExists')
        .mockReturnValue(of(false));

      displayName = screen.getByLabelText('Display Name');
      email = screen.getByLabelText('Email Address');
      password = screen.getByLabelText('Password');
      repeatPassword = screen.getByLabelText('Repeat Password');
      await user.type(displayName, 'luckyboy224');
      await user.type(email, 'luckyboy@gmail.com');
      await user.type(password, 'P@$$w0rd');
      await user.type(repeatPassword, 'P@$$w0rd');

      await waitFor(
        () => expect(accountServiceMock.checkEmailExists).toBeCalledTimes(1),
        {
          timeout: 2000,
        }
      );
      button = screen.getByRole('button', { name: 'Sign up' });
    };

    it('navigate to "/shop" route after successfull registration', async () => {
      jest
        .spyOn(accountServiceMock, 'checkEmailExists')
        .mockReturnValue(of(false));

      jest.spyOn(accountServiceMock, 'register').mockReturnValue(of(null));
      const spyNavigateByUrl = jest.spyOn(router, 'navigateByUrl');
      await setupForm();
      await user.click(button);
      expect(accountServiceMock.register).toHaveBeenCalledWith({
        displayName: 'luckyboy224',
        email: 'luckyboy@gmail.com',
        password: 'P@$$w0rd',
      });

      expect(spyNavigateByUrl).toHaveBeenCalledWith('/shop');
    });

    it('enable the button when all fields have valid input', async () => {
      await setupForm();
      expect(button).toBeEnabled();
    });

    it('disable button when there is an outgoing api call', async () => {
      jest
        .spyOn(accountServiceMock, 'checkEmailExists')
        .mockReturnValue(of(false));

      jest.spyOn(accountServiceMock, 'register').mockReturnValue(of(null));
      await setupForm();
      await user.click(button);
      await user.click(button);
      expect(accountServiceMock.register).toHaveBeenCalledTimes(1);
    });

    it('display validation error coming from backend after submit failure', async () => {
      const validationError = { errors: ['Validation error message'] };
      jest
        .spyOn(accountServiceMock, 'register')
        .mockReturnValue(throwError(() => validationError));

      await setupForm();
      await user.click(button);
      expect(
        await screen.findByText(validationError.errors[0])
      ).toBeInTheDocument();
    });

    it('display spinner after clicking the submit', async () => {
      jest
        .spyOn(accountServiceMock, 'checkEmailExists')
        .mockReturnValue(of(false));

      jest.spyOn(accountServiceMock, 'register').mockReturnValue(of(null));
      await setupForm();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      await user.click(button);
      expect(screen.queryByRole('status')).toBeInTheDocument();
    });

    it('hide spinner after sign up request fails', async () => {
      const validationError = { errors: ['Validation error message'] };
      jest
        .spyOn(accountServiceMock, 'register')
        .mockReturnValue(throwError(() => validationError));
      await setupForm();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      await user.click(button);
      expect(
        await screen.findByText(validationError.errors[0])
      ).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    let button: any;
    let displayName: any;
    let email: any;
    let password: any;
    let repeatPassword: any;
    const setupForm = async ({ emailTaken = false } = {}) => {
      jest
        .spyOn(accountServiceMock, 'checkEmailExists')
        .mockReturnValue(of(emailTaken));
      displayName = screen.getByLabelText('Display Name');
      email = screen.getByLabelText('Email Address');
      password = screen.getByLabelText('Password');
      repeatPassword = screen.getByLabelText('Repeat Password');
      await user.type(displayName, 'luckyboy224');
      await user.type(email, 'luckyboy@gmail.com');
      await waitFor(
        () => expect(accountServiceMock.checkEmailExists).toBeCalledTimes(1),
        {
          timeout: 2000,
        }
      );
      await user.type(password, 'P@$$w0rd');
      await user.type(repeatPassword, 'P@$$w0rd');
      button = screen.getByRole('button', { name: 'Sign up' });
    };

    it.each`
      label                | inputValue                | message
      ${'Display Name'}    | ${'{space}{backspace}'}   | ${'Please enter your Display Name'}
      ${'Email Address'}   | ${'{space}{backspace}'}   | ${'Please enter your Email Address'}
      ${'Email Address'}   | ${'wrong-email'}          | ${'Invalid email address'}
      ${'Email Address'}   | ${'emailTaken@gmail.com'} | ${'Email address is taken'}
      ${'Password'}        | ${'paSS1234'}             | ${'Password not complex enough'}
      ${'Password'}        | ${'paSSwor'}              | ${'Password not complex enough'}
      ${'Repeat Password'} | ${'P@$$w0rd123'}          | ${'Passwords do not match'}
    `(
      'display $message when $label has the value $inputValue',
      async ({ label, inputValue, message }) => {
        if (inputValue === 'emailTaken@gmail.com') {
          await setupForm({ emailTaken: true });
        } else {
          await setupForm();
          expect(screen.queryByText(message)).not.toBeInTheDocument();
        }
        const input = screen.getByLabelText(label);
        await user.click(input);
        await user.clear(input);
        await user.type(input, inputValue);
        await user.tab();
        if (inputValue === 'emailTaken@gmail.com') {
          expect(screen.queryByText(message)).not.toBeInTheDocument();
          await waitFor(
            () =>
              expect(accountServiceMock.checkEmailExists).toHaveBeenCalledTimes(
                2
              ),
            {
              timeout: 2000,
            }
          );
        }
        if (inputValue === 'P@$$w0rd123') {
          await user.click(password);
        }

        const errorMessage = await screen.findByText(message);
        expect(errorMessage).toBeInTheDocument();
      }
    );

    it.each`
      label                | inputValue
      ${'Display Name'}    | ${'username1234'}
      ${'Email Address'}   | ${'goodEmail@gmail.com'}
      ${'Password'}        | ${'P@$$w0rd'}
      ${'Repeat Password'} | ${'P@$$w0rd'}
    `(
      'not display an error message when $label has the value $inputValue',
      async ({ label, inputValue }) => {
        await setupForm();
        const input = screen.getByLabelText(label);
        await user.click(input);
        await user.clear(input);
        await user.type(input, inputValue);
        await user.tab();

        // Expect no error message to be displayed
        expect(
          screen.queryByText(`Please enter your ${label}`)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Invalid email address')
        ).not.toBeInTheDocument();

        if (label === 'Email Address') {
          await waitFor(() => {
            expect(
              screen.queryByText('Email address is taken')
            ).not.toBeInTheDocument();
          });
        }

        expect(
          screen.queryByText('Password not complex enough')
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText('Passwords do not match')
        ).not.toBeInTheDocument();
      }
    );
  });
});

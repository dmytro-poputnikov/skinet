import { render, screen } from '@testing-library/angular';
import { LoginComponent } from './login.component';
import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('Login Component', () => {
  beforeEach(async () => {
    await render(LoginComponent, {
      declarations: [TextInputComponent],
      imports: [ReactiveFormsModule],
    });
  });

  it('should create', () => {
    expect(screen.getByTestId('login-component-container')).toBeTruthy();
  });

  describe('Layout', () => {
    it('has Login header', () => {
      expect(
        screen.getByRole('heading', { name: 'Login' })
      ).toBeInTheDocument();
    });

    it('has email input', () => {
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('has email type for email input', () => {
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
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
  });

  describe('Iteractions', () => {});
});

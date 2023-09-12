import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  finalize,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  reqInProgress = false;
  errors: string[] | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  complexPassword =
    "(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$";

  registerForm = this.fb.group(
    {
      displayName: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.validateEmailNotTaken()],
      ],
      password: [
        '',
        [Validators.required, Validators.pattern(this.complexPassword)],
      ], //https://regexlib.com/ - password
      repeatPassword: ['', [Validators.required]],
    },
    { validators: this.matchPassword }
  ); // Add the custom validator here);

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('repeatPassword')?.value;
    // console.log(confirm);

    if (
      password != confirm &&
      password !== null &&
      confirm !== null &&
      !control.get('password')?.invalid &&
      control.get('password')?.touched
    ) {
      control.get('repeatPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    this.reqInProgress = true;
    const { displayName, email, password } = this.registerForm.value;
    this.accountService
      .register({ displayName, email, password })
      // .pipe(finalize(() => (this.reqInProgress = false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/shop'),
        error: error => {
          this.reqInProgress = false;
          this.errors = error.errors;
        },
      });
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.valueChanges) {
        return of(null);
      }
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          return this.accountService.checkEmailExists(control?.value).pipe(
            map(result => {
              return result ? { emailExists: true } : null;
            }),
            catchError(() => of({ emailExists: true })),
            finalize(() => control.markAsTouched())
          );
        })
      );
    };
  }
}

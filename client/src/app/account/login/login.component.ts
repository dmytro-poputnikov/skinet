import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  returnUrl = '';
  // constructor(
  //   // private accountService: AccountService,
  //   // private router: Router,
  //   // private activatedRoute: ActivatedRoute
  // ) {
  //   this.returnUrl =
  //     this.activatedRoute.snapshot.queryParams['returnUrl'] || '/shop';
  // }
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  onSubmit() {
    // this.accountService.login(this.loginForm.value).subscribe({
    //   next: () => this.router.navigateByUrl(this.returnUrl),
    // });
  }
}

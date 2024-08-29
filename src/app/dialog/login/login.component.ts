import {Component, Inject} from '@angular/core';
import {LoginDto} from "../../dto/login-dto";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../model/user";
import {RegisterComponent} from "../register/register.component";
import {Router} from "@angular/router";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<LoginComponent>,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  login() {
    const loginDto: LoginDto = {
      email: this.email,
      password: this.password
    };
    this.userService.login(loginDto).subscribe(() => {
      this.dialogRef.close();
      this.router.navigate(['/home']).then(() => location.reload());
    });
  }
}

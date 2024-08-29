import {Component, OnInit} from '@angular/core';
import {LoginComponent} from "../../dialog/login/login.component";
import {RegisterComponent} from "../../dialog/register/register.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated!: boolean;
  username!: string;
  role!: string;

  constructor(public dialog: MatDialog, private readonly userService: UserService, private readonly router: Router) {
  }

  register(): void {
    this.dialog.open(RegisterComponent);
  }

  login(): void {
    this.dialog.open(LoginComponent);
  }

  async ngOnInit() {
    this.userService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.username = localStorage.getItem('username') || '';
      this.role = localStorage.getItem('role') || '';
    });
  }


  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.router.navigate(['/' + 'home']).then(() => {
      location.reload();
    });

  }
}

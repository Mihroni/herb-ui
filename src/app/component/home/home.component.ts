import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements  OnInit {

  isAuthenticated!: boolean;
  username!: string;
  role!: string;

  constructor(private readonly userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    this.userService.isAuthenticated.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.username = localStorage.getItem('username') || '';
      this.role = localStorage.getItem('role') || '';
    });
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../model/user";
import {LoginComponent} from "../login/login.component";
import {UserService} from "../../service/user.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  id = '';
  email = '';
  password = '';
  username = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    public dialogRef: MatDialogRef<RegisterComponent>,
    private readonly userService: UserService,
    public dialog: MatDialog
  ) {}

  async save() {
    const user: User = {
      id: this.id,
      email: this.email,
      username: this.username,
      password: this.password
    };

    try {
      // Await the completion of the registration request
      await firstValueFrom(this.userService.register(user));

      // Close the dialog after the registration is successful
      this.dialogRef.close();

      // Open the LoginComponent
      this.dialog.open(LoginComponent);
    } catch (error) {
      console.error('Registration failed', error);
      // Optionally, handle the error (e.g., show a notification to the user)
    }
  }
}

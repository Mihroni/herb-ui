import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RegisterComponent} from "./dialog/register/register.component";
import {LoginComponent} from "./dialog/login/login.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './component/home/home.component';
import { UserHomeComponent } from './component/user-home/user-home.component';
import { HeaderComponent } from './component/header/header.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AddHerbDialogComponent } from './dialog/add-herb-dialog/add-herb-dialog.component';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { ViewHerbComponent } from './component/view-herb/view-herb.component';
import { GroupComponent } from './component/group/group.component';
import { AddGroupDialogComponent } from './dialog/add-group-dialog/add-group-dialog.component';
import { ChatComponent } from './component/chat/chat.component';
import { UpdateHerbDialogComponent } from './dialog/update-herb-dialog/update-herb-dialog.component';
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UserHomeComponent,
    HeaderComponent,
    AddHerbDialogComponent,
    ViewHerbComponent,
    GroupComponent,
    AddGroupDialogComponent,
    ChatComponent,
    UpdateHerbDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxPaginationModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

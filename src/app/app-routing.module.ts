import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./dialog/login/login.component";
import {HomeComponent} from "./component/home/home.component";
import {ViewHerbComponent} from "./component/view-herb/view-herb.component";
import {GroupComponent} from "./component/group/group.component";
import {ChatComponent} from "./component/chat/chat.component";



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'home', component: HomeComponent},
  {path: 'chat/:id', component: ChatComponent},
  { path: 'herb/:herbId', component: ViewHerbComponent },
  { path: 'group/:locationId', component: GroupComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

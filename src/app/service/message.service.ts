import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MessageDto} from "../dto/message-dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {
  }


  sendMessage(messageDto: MessageDto): Observable<any> {
    return this.http.post(`http://localhost:8080/messages`, messageDto);
  }

}

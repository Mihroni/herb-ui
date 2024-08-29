import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GroupDto} from "../dto/group-dto";
import {Observable} from "rxjs";
import {Group} from "../model/group";
import {Message} from "../model/message";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {}

  create(groupDto: GroupDto): Observable<Group> {
    return this.http.post<Group>(`http://localhost:8080/groups`, groupDto);
  }

  update(id: string, groupDto: GroupDto): Observable<Group> {
    return this.http.put<Group>(`http://localhost:8080/groups/${id}`, groupDto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/groups/${id}`);
  }

  findById(id: string): Observable<Group> {
    return this.http.get<Group>(`http://localhost:8080/groups/${id}`);
  }

  findAll(): Observable<Group[]> {
    return this.http.get<Group[]>(`http://localhost:8080/groups`);
  }

  findAllByLocationId(locationId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`http://localhost:8080/groups/location?locationId=${locationId}`);
  }

  activity(id: string): Observable<void> {
    return this.http.get<void>(`http://localhost:8080/groups/activity/${id}`);
  }

  viewChat(id: string): Observable<Message[]> {
    return this.http.get<Message[]>(`http://localhost:8080/groups/chat/${id}`);
  }

}

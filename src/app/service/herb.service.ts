import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Herb} from "../model/herb";
import {HerbDto} from "../dto/herb-dto";
import {Group} from "../model/group";

@Injectable({
  providedIn: 'root'
})
export class HerbService {

  constructor(private http: HttpClient) {}

  // Create a new herb
  create(herbDto: HerbDto): Observable<Herb> {
    return this.http.post<Herb>(`http://localhost:8080/herbs`, herbDto);
  }

  // Update an existing herb by ID
  update(id: string, herbDto: Herb): Observable<Herb> {
    return this.http.put<Herb>(`http://localhost:8080/herbs/${id}`, herbDto);
  }

  // Delete a herb by ID
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/herbs/${id}`);
  }

  // Find a herb by ID
  findById(id: string): Observable<Herb> {
    return this.http.get<Herb>(`http://localhost:8080/herbs/${id}`);
  }

  // Get all herbs
  findAll(): Observable<Herb[]> {
    return this.http.get<Herb[]>(`http://localhost:8080/herbs`);
  }

  findByLocationId(locationId: string): Observable<Herb> {
    return this.http.get<Herb>(`http://localhost:8080/herbs/location?locationId=${locationId}`);
  }
}

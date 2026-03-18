import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Fetches users from the JSONPlaceholder API.
 * Base URL is hardcoded — this is a demo app with no environment config.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  /**
   * Returns all users. Filtering by query term is done in the component.
   * JSONPlaceholder does not support server-side filtering.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

/**
 * Searches users by name, username, or email with 300ms debounce.
 * Fetches all users once on init — filtering is client-side.
 * Loading, error, and empty states are handled explicitly.
 */
@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => this.filterUsers(query ?? ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        console.error('UserSearchComponent: failed to load users', err);
      }
    });
  }

  private filterUsers(query: string): void {
    if (!query.trim()) {
      this.filteredUsers = this.users;
      return;
    }
    const lower = query.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(lower) ||
      user.username.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower)
    );
  }

  retry(): void {
    this.loadUsers();
  }
}

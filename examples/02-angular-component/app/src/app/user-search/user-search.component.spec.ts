import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { UserSearchComponent } from './user-search.component';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

const mockUsers: User[] = [
  { id: 1, name: 'Alice Smith', username: 'alice', email: 'alice@example.com', phone: '', website: '', company: { name: 'ACME' } },
  { id: 2, name: 'Bob Jones', username: 'bjones', email: 'bob@example.com', phone: '', website: '', company: { name: 'Globex' } },
  { id: 3, name: 'Charlie Brown', username: 'charlie', email: 'charlie@example.com', phone: '', website: '', company: { name: 'Initech' } }
];

describe('UserSearchComponent', () => {
  let component: UserSearchComponent;
  let fixture: ComponentFixture<UserSearchComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [UserSearchComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
  });

  function createComponent(): void {
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('loadUsers_onInit_populatesFilteredUsers', () => {
    createComponent();
    expect(component.filteredUsers.length).toBe(3);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('filterUsers_matchingQuery_returnsMatchingUsers', fakeAsync(() => {
    createComponent();
    component.searchControl.setValue('alice');
    tick(300);
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Alice Smith');
  }));

  it('filterUsers_emptyQuery_returnsAllUsers', fakeAsync(() => {
    createComponent();
    component.searchControl.setValue('bob');
    tick(300);
    component.searchControl.setValue('');
    tick(300);
    expect(component.filteredUsers.length).toBe(3);
  }));

  it('filterUsers_noMatch_returnsEmptyArray', fakeAsync(() => {
    createComponent();
    component.searchControl.setValue('zzznomatch');
    tick(300);
    expect(component.filteredUsers.length).toBe(0);
  }));

  it('filterUsers_matchesByUsername', fakeAsync(() => {
    createComponent();
    component.searchControl.setValue('bjones');
    tick(300);
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].username).toBe('bjones');
  }));

  it('filterUsers_matchesByEmail', fakeAsync(() => {
    createComponent();
    component.searchControl.setValue('charlie@example');
    tick(300);
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Charlie Brown');
  }));

  it('loadUsers_serviceThrows_setsErrorState', () => {
    userServiceSpy.getUsers.and.returnValue(throwError(() => new Error('network error')));
    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
    expect(component.filteredUsers.length).toBe(0);
  });

  it('retry_afterError_reloadsUsers', () => {
    userServiceSpy.getUsers.and.returnValue(throwError(() => new Error('network error')));
    fixture = TestBed.createComponent(UserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    component.retry();

    expect(component.error).toBeNull();
    expect(component.filteredUsers.length).toBe(3);
  });
});

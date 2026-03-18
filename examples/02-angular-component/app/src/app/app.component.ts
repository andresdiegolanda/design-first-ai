import { Component } from '@angular/core';
import { UserSearchComponent } from './user-search/user-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserSearchComponent],
  template: `
    <h1>User Search</h1>
    <app-user-search />
  `
})
export class AppComponent {}

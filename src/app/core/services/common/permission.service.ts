import { Injectable, OnInit } from '@angular/core';
import { UiQuery } from '../State/ui/ui.query';
import { AppUserStore } from '../State/user/app-user.store';
import { AppUserQuery } from '../State/user/app-user.query';
import { AppUser } from '@app/models/user.model';
import { AppRole } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements OnInit {

  appUser: AppUser;

  constructor(private appUserQuery: AppUserQuery) { }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.appUserQuery.appUser$.subscribe(x => {
      this.appUser = x;
    })
  }

  hasRole(role: string): boolean {
    return this.appUser.roles.includes(role);
  }
}

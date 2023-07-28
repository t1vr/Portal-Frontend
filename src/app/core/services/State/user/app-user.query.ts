import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

import { AppUserStore } from "./app-user.store";
import { AppUser } from "@app/models/user.model";

@Injectable({
  providedIn: "root",
})
export class AppUserQuery extends Query<AppUser> {
  appUser$ = this.select();
  constructor(private appUserStore: AppUserStore) {
    super(appUserStore);
  }
}

import { Injectable } from "@angular/core";
import { AppUser } from "@app/models/user.model";
import { Store, StoreConfig } from "@datorama/akita";

export function createInitialUIState(): AppUser {
  return {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    imageUrl: null,
    isActive: null,
    tenantId:null,
    roles:[]
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "appUser", resettable: false })
export class AppUserStore extends Store<AppUser> {
  constructor() {
    super(createInitialUIState());
  }
}

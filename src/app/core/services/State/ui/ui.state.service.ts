import { Injectable } from "@angular/core";
import { UiStore } from "./ui.store";
import { UiQuery } from "./ui.query";
import { Observable } from "rxjs";
import { Tenant } from "@app/models/tenant.model";

@Injectable({ providedIn: "root" })
export class UiStateService {
  constructor(private uiStore: UiStore, private uiQuery: UiQuery) { }

  saveTenantIdentifier(tenantIdentifier: string): void {
    this.uiStore.update((state) => {
      tenantIdentifier: tenantIdentifier;
    });

  }

  getTenantIdentifier(): Observable<string> {
    return this.uiQuery.select((ui) => ui.tenantIdentifier);
  }

  saveTenantStateInfo(tenant: Tenant) {
    this.uiStore.update({ tenant: tenant });
  }

  getTenantStateInfo(): Observable<Tenant> {
    return this.uiQuery.select((ui) => ui.tenant) as Observable<Tenant>;
  }
}

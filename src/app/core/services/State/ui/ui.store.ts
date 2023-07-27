import { Injectable } from "@angular/core";
import { Tenant } from "@app/models/tenant.model";
import { Store, StoreConfig } from "@datorama/akita";

export class UiState {
  tenantIdentifier: string;
  tenant: Tenant;
  currentlySelectedTabIndex: number;
}

export function createInitialUIState(): UiState {
  return {
    tenantIdentifier: "",
    tenant: null,
    currentlySelectedTabIndex: 0
  };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "ui", resettable: false })
export class UiStore extends Store<UiState> {
  constructor() {
    super(createInitialUIState());
  }
}

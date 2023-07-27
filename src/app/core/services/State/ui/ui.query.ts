import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

import { UiState, UiStore } from "./ui.store";

@Injectable({
  providedIn: "root",
})
export class UiQuery extends Query<UiState> {
  currentlySelectedTabIndex$ = this.select(x => x.currentlySelectedTabIndex);
  constructor(private uiStore: UiStore) {
    super(uiStore);
  }
}

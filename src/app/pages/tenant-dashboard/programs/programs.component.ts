import { Component, OnInit } from '@angular/core';
import { UiStore } from '@app/core/services/State/ui/ui.store';
import { PermissionService } from '@app/core/services/common/permission.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {

  constructor(private uiStore: UiStore,
    private permissionService: PermissionService) { }

  ngOnInit() {
    this.uiStore.update({ currentlySelectedTabIndex: 1 });
  }

}

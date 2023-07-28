import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from "@angular/core";
import { PageHeaderType } from "@app/shared/components/page-header/page-header.component";
import { NzSafeAny } from "ng-zorro-antd/core/types";
import { UiStateService } from "@app/core/services/State/ui/ui.state.service";
import { Tenant } from "@app/models/tenant.model";
import { UiStore } from "@app/core/services/State/ui/ui.store";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.less"],
})
export class OverviewComponent {
  @ViewChild("pageHeaderContent", { static: false })
  pageHeaderContent!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: "",
    desc: "",
  };

  tenant: Tenant;
  constructor(private uiStateService: UiStateService,
    private uiStore: UiStore,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.uiStore.update({ currentlySelectedTabIndex: 0 });
    this.fetchTenantData();
  }

  fetchTenantData() {
    this.uiStateService.getTenantStateInfo().subscribe((tenant: Tenant) => {
      this.tenant = tenant;
      this.pageHeaderInfo = {
        title: this.tenant ? this.tenant.name : "No Title",
        desc: this.pageHeaderContent,
      };
      this.cdRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.tenant ? this.tenant.name : "No Title",
      desc: this.pageHeaderContent,
    };

  }
}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { UiStateService } from "@app/core/services/State/ui/ui.state.service";
import { LocalStorageService } from "@app/core/services/common/local.storage.service";
import { TenantService } from "@app/core/services/common/tenant.service";
import { BaseResponse } from "@app/models/response.model";
import { Tenant } from "@app/models/tenant.model";

@Component({
  selector: "app-tenant-dashboard",
  templateUrl: "./tenant-dashboard.component.html",
  styleUrls: [],
})
export class TenantDashboardComponent implements OnInit {
  tenant: Tenant;

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private tenantService: TenantService,
    private uiStateService: UiStateService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.acitvatedRoute.params.subscribe((params: Params) => {
      if (params["tenantIdentifier"]) {
        this.tenantService
          .getTenantByIdentifier(params["tenantIdentifier"])
          .subscribe((response: BaseResponse<Tenant>) => {
            if (response.succeeded) {
              this.tenant = response.data;
              this.localStorageService.setTenantIdentifier(params['tenantId'])
              this.uiStateService.saveTenantStateInfo(this.tenant);
            }
          });
      }
    });
  }
}




import { Injectable } from "@angular/core";
import { BaseResponse } from "@app/models/response.model";
import { Tenant } from "@app/models/tenant.model";
import { Observable } from "rxjs";
import { TenantDataService } from "../data/tenant.data.service";

@Injectable({
  providedIn: "root",
})
export class TenantService {
  constructor(private tenantDataService: TenantDataService) { }

  getTenantByIdentifier(
    tenantIdentifier: number
  ): Observable<BaseResponse<Tenant>> {
    return this.tenantDataService.getTenantByIdentifier(tenantIdentifier);
  }
}

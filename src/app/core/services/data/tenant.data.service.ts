import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseDataService } from '@app/core/services/data/base.data.service';
import { TenantApiConstants } from '@app/models/api.constants';
import { BaseResponse } from '@app/models/response.model';
import { Tenant } from '@app/models/tenant.model';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../common/local.storage.service';

@Injectable({ providedIn: "root" })
export class TenantDataService extends BaseDataService {
  constructor(
    private httpClient: HttpClient,
    private _localStorageService: LocalStorageService
  ) {
    super(_localStorageService);
  }

  getTenantByIdentifier(
    tenantIdentifier: number
  ): Observable<BaseResponse<Tenant>> {
    return this.httpClient.get<BaseResponse<Tenant>>(
      this.getFullApiUrl(
        TenantApiConstants.TENANT_MODULE,
        TenantApiConstants.GET_BY_ID_ENDPOINT
      ) + tenantIdentifier,
      this.getHttpOptions(false, false, false)
    );
  }
}

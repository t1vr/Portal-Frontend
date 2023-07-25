import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseDataService } from "./base.data.service";
import { CreateTenantResponseModel, LoginResponseModel } from "src/app/models/response.model";
import { AuthApiConstants, TenantApiConstants } from "src/app/models/api.constants";
import { Observable } from "rxjs";
import { LocalStorageService } from "../common/local.storage.service";
import { CreateTenantRequestModel, LoginRequestModel } from "@app/models/request.model";

@Injectable({ providedIn: "root" })
export class AuthDataService extends BaseDataService {

  constructor(private httpClient: HttpClient,
    private _localStorageService: LocalStorageService) {
    super(_localStorageService);
  }

  login(loginRequestModel: LoginRequestModel): Observable<LoginResponseModel> {
    return this.httpClient.post<LoginResponseModel>(
      this.getFullApiUrl(AuthApiConstants.AUTH_MODULE, AuthApiConstants.LOGIN),
      loginRequestModel,
      this.getHttpOptions(false, false, false));
  }

  createTenant(createTenantRequestModel: CreateTenantRequestModel): Observable<CreateTenantResponseModel> {
    return this.httpClient.post<CreateTenantResponseModel>(
      this.getFullApiUrl(TenantApiConstants.TENANT_MODULE, TenantApiConstants.CREATE_ENDPOINT),
      createTenantRequestModel,
      this.getHttpOptions(false, false, false));
  }
}


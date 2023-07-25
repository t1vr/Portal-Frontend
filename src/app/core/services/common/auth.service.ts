import { Injectable } from '@angular/core';
import { AuthDataService } from '../data/auth.data.service';
import { CreateTenantRequestModel, LoginRequestModel } from '@app/models/request.model';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local.storage.service';
import { CreateTenantResponseModel, LoginResponseModel } from '@app/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private authDataService: AuthDataService,
    private localStorageService: LocalStorageService) { }

  login(loginRequestModel: LoginRequestModel): Observable<LoginResponseModel> {
    this.localStorageService.setTenantIdentifier(loginRequestModel.tenantIdentifier);
    return this.authDataService.login(loginRequestModel);
  }

  registerTenant(createTenantRequestModel: CreateTenantRequestModel): Observable<CreateTenantResponseModel> {
    this.localStorageService.setTenantIdentifier(createTenantRequestModel.identifier);
    return this.authDataService.createTenant(createTenantRequestModel);
  }

}


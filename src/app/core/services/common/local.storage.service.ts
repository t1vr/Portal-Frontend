import { Injectable } from '@angular/core';
import { TokenHeaderKey, TokenKey, TokenPrefix } from '@app/config/constant';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  setTenantIdentifier(tenantIdentifier: string): void {
    localStorage.setItem('tenantIdentifier', tenantIdentifier);
  }


  getTenantIdentifier(): string {
    return localStorage.getItem('tenantIdentifier') as string;
  }

  setUserToken(token: string) {
    localStorage.setItem(TokenKey, token);
  }

  getUserToken(): string {
    return localStorage.getItem(TokenHeaderKey) as string;
  }

}

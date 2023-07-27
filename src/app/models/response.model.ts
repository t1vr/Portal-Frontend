export interface BaseResponse<T> {
  message: string;
  statusCode: number;
  succeeded: boolean;
  data: T;
}

export interface BaseAuditableResponse {
  createdBy: Date;
  createdAt: Date;
  lastModifiedBy: Date;
  lastModifiedAt: Date;
}

export interface LoginResponseModel {
  token: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}

export interface CreateTenantResponseModel {
  id: string;
}

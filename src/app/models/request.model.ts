
export interface BaseRequestModel {
}

export interface LoginRequestModel extends BaseRequestModel {
  tenantIdentifier: string;
  email: string;
  password: string;
}


export class CreateTenantRequestModel {
  identifier!: string;
  name!: string;
  firstName!: string;
  lastName!: string;
  adminEmail!: string;
  password!: string;
}


export interface CreateProgramRequest extends BaseRequestModel{
  id:string;
  name:string;
}

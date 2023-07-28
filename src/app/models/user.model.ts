import { Role } from "@app/core/services/http/system/role.service";

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  isActive: string;
  roles: string[];
  tenantId: string;
}

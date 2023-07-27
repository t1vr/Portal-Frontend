import { BaseAuditableResponse } from "./response.model";

export interface Tenant extends BaseAuditableResponse {
    id: string;
    identifier: string;
    name: string;
    description: string;
    adminEmail: string;
    isActive: boolean;
    validUpTo: Date;
}

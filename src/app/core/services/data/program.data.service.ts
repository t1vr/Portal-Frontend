import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseDataService } from "./base.data.service";
import { BaseResponse } from "src/app/models/response.model";
import { CourseItem, ProgramItem } from "src/app/models/course.model";
import { ProgramApiConstants } from "src/app/models/api.constants";
import { Observable } from "rxjs";
import { LocalStorageService } from "../common/local.storage.service";

@Injectable({ providedIn: "root" })
export class ProgramDataService extends BaseDataService {

    constructor(private httpClient: HttpClient,
        private _localStorageService: LocalStorageService) {
        super(_localStorageService);
    }

    getAllPrograms(): Observable<BaseResponse<ProgramItem[]>> {
        return this.httpClient.get<BaseResponse<ProgramItem[]>>(
            this.getFullApiUrl(ProgramApiConstants.PROGRAM_MODULE, ""), this.getHttpOptions(false, true, false));
    }

    getProgramByProgramId(programId: number): Observable<BaseResponse<ProgramItem>> {
        return this.httpClient.get<BaseResponse<ProgramItem>>(
            this.getFullApiUrl(ProgramApiConstants.PROGRAM_MODULE, "") + programId,
            this.getHttpOptions(false, true, false));
    }
}

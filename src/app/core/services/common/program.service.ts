import { Injectable } from "@angular/core";
import { ProgramItem } from "@app/models/course.model";
import { CreateProgramRequest } from "@app/models/request.model";
import { BaseResponse } from "@app/models/response.model";
import { Observable } from "rxjs";
import { ProgramDataService } from "../data/program.data.service";

@Injectable({ providedIn: "root" })
export class ProgramService {
  constructor(private programDataService: ProgramDataService) {
  }

  createProgram(createProgramRequest: CreateProgramRequest): Observable<BaseResponse<ProgramItem>> {
    return this.programDataService.createProgram(createProgramRequest);
  }
  getAllPrograms(): Observable<BaseResponse<ProgramItem[]>> {
    return this.programDataService.getAllPrograms();
  }

  getProgramByProgramId(id: number): Observable<BaseResponse<ProgramItem>> {
    return this.programDataService.getProgramByProgramId(id);
  }
}

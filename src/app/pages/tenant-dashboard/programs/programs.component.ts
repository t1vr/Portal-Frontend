import { Component, Injectable, OnInit } from '@angular/core';
import { UiStore } from '@app/core/services/State/ui/ui.store';
import { LocalStorageService } from '@app/core/services/common/local.storage.service';
import { PermissionService } from '@app/core/services/common/permission.service';
import { ProgramDataService } from '@app/core/services/data/program.data.service';
import { CourseItem, ProgramItem } from '@app/models/course.model';
import { BaseResponse } from '@app/models/response.model';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzProgressStatusType } from 'ng-zorro-antd/progress';
import { Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent implements OnInit {

  isSpinning = false;
  tenantIdentifier: string;

  programs: ProgramItem[] = [];
  courses: CourseItem[] = [];

  constructor(private localStorageService: LocalStorageService,
    private programService: ProgramService) { }

  ngOnInit(): void {
    this.tenantIdentifier = this.localStorageService.getTenantIdentifier();
    this.loadAllProgramOfTenant();
  }

  loadAllProgramOfTenant() {
    this.programService.getAllPrograms()
      .subscribe((response: BaseResponse<ProgramItem[]>) => {
        if (response.succeeded) {
          this.programs = response.data;
          if (this.programs.length > 0) {
            this.loadProgramWithCourses(this.programs[0].id);
          }
        }
      })
  }

  loadProgramWithCourses(programId: number) {
    this.programService.getProgramByProgramId(programId)
      .subscribe((response: BaseResponse<ProgramItem>) => {
        if (response.succeeded) {
          this.courses = response.data.courses;
        }
      });
  }

}

@Injectable({ providedIn: "root" })
export class ProgramService {
  constructor(private programDataService: ProgramDataService) {
  }

  getAllPrograms(): Observable<BaseResponse<ProgramItem[]>> {
    return this.programDataService.getAllPrograms();
  }

  getProgramByProgramId(id: number): Observable<BaseResponse<ProgramItem>> {
    return this.programDataService.getProgramByProgramId(id);
  }
}

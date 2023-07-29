import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '@app/core/services/common/local.storage.service';
import { ProgramService } from '@app/core/services/common/program.service';
import { CourseItem, ProgramItem } from '@app/models/course.model';
import { BaseResponse } from '@app/models/response.model';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.less']
})
export class ProgramsComponent implements OnInit {

  tenantIdentifier: string;

  programs: ProgramItem[] = [];
  courses: CourseItem[] = [];
  validateForm!: UntypedFormGroup;

  isVisible = false;

  constructor(private fb: UntypedFormBuilder,
    private localStorageService: LocalStorageService,
    private programService: ProgramService) { }

  ngOnInit(): void {
    this.initForm();
    this.tenantIdentifier = this.localStorageService.getTenantIdentifier();
    this.loadAllProgramOfTenant();
  }

  initForm() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }


  showCreateProgramModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  submitForm(): void {
    if (this.validateForm.valid) {
      this.isVisible = false;
      this.programService.createProgram(this.validateForm.value)
        .subscribe((response: BaseResponse<ProgramItem>) => {
          if (response.succeeded) {
            this.handleCancel();
            this.loadAllProgramOfTenant();
          }
        })
    } else {
      this.validateForm.markAsDirty();
    }
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


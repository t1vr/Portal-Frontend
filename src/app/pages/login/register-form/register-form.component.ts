import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/common/auth.service';
import { CreateTenantRequestModel } from '@app/models/request.model';
import { CreateTenantResponseModel } from '@app/models/response.model';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  submitForm(): void {
    Object.keys(this.validateForm.controls).forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }

    var createTenantRequestModel = new CreateTenantRequestModel();
    createTenantRequestModel.adminEmail = this.validateForm.value.adminEmail;
    createTenantRequestModel.name = this.validateForm.value.name;
    createTenantRequestModel.identifier = this.validateForm.value.name;
    createTenantRequestModel.firstName = this.validateForm.value.name;
    createTenantRequestModel.lastName = this.validateForm.value.name;
    createTenantRequestModel.password = this.validateForm.value.password;

    this.authService.registerTenant(createTenantRequestModel).subscribe(
      (_: CreateTenantResponseModel) => {
        this.router.navigateByUrl('login/login-form')
      }
    )
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      adminEmail: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    }, {
      validators: MustMatch('password', 'confirmPassword')
    });
  }

}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (group: AbstractControl) => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    // return if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  }
}


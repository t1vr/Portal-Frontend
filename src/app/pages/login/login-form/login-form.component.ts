import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SpinService } from '@store/common-store/spin.service';
import { fnCheckForm } from '@utils/tools';
import { LocalStorageService } from '@app/core/services/common/local.storage.service';
import { AuthService } from '@app/core/services/common/auth.service';
import { LoginResponseModel } from '@app/models/response.model';
import { AppUserStore } from '@app/core/services/State/user/app-user.store';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private spinService: SpinService,
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private appUserStore: AppUserStore
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      tenantIdentifier: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }

    this.spinService.setCurrentGlobalSpinStore(true);
    this.authService.login(this.validateForm.value).subscribe(
      (response: LoginResponseModel) => {
        this.localStorageService.setUserToken(response.token);
        this.appUserStore.update({ ...response.userResponse })
        this.spinService.setCurrentGlobalSpinStore(false);
        this.router.navigateByUrl(`default/${response.userResponse.tenantId}/overview`);
      },
      (error) => {
        this.spinService.setCurrentGlobalSpinStore(false);

      }
    )
  }
}

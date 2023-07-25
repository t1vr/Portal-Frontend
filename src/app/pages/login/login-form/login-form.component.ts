import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@core/services/http/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnCheckForm } from '@utils/tools';
import { LocalStorageService } from '@app/core/services/common/local.storage.service';
import { AuthService } from '@app/core/services/common/auth.service';
import { LoginResponseModel } from '@app/models/response.model';

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
    private localStorageService: LocalStorageService
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
      (x: LoginResponseModel) => {
        this.localStorageService.setUserToken(x.token);
        this.spinService.setCurrentGlobalSpinStore(false);
        this.router.navigateByUrl('default/dashboard/workbench');
      }
    )
  }
}

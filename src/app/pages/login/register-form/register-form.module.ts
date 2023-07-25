import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { RegisterFormRoutingModule } from './register-form-routing.module';
import { RegisterFormComponent } from './register-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegisterFormComponent],
  imports: [ReactiveFormsModule,SharedModule, RegisterFormRoutingModule]
})
export class RegisterFormModule {}

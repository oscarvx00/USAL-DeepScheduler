import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ErrorDialogComponent } from './components/utils/error-dialog/error-dialog.component';
import { TensorflowComponent } from './components/default-images/tensorflow/tensorflow.component';
import { PytorchComponent } from './components/default-images/pytorch/pytorch.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'me', component: ProfileComponent},
  {path: 'default-images/tensorflow', component: TensorflowComponent},
  {path: 'default-images/pytorch', component: PytorchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

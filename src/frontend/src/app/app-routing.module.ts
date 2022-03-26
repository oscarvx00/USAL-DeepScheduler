import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ErrorDialogComponent } from './components/utils/error-dialog/error-dialog.component';
import { TensorflowComponent } from './components/default-images/tensorflow/tensorflow.component';
import { PytorchComponent } from './components/default-images/pytorch/pytorch.component';
import { TrainingHomeComponent } from './components/training/training-home/training-home.component';
import { TrainingNewComponent } from './components/training/training-new/training-new.component';
import { TrainingDetailComponent } from './components/training/training-detail/training-detail.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'me', component: ProfileComponent},
  {path: 'default-images/tensorflow', component: TensorflowComponent},
  {path: 'default-images/pytorch', component: PytorchComponent},
  {path: 'training', component: TrainingHomeComponent},
  {path: 'training/new', component: TrainingNewComponent},
  {path: 'training/:id', component: TrainingDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

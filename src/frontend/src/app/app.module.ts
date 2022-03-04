import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'; 
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  HighlightModule,
  HIGHLIGHT_OPTIONS,
  HighlightOptions,
} from 'ngx-highlightjs';

import { AuthDataSharingService } from './services/auth/user-data-sharing';
import { AuthInterceptorService } from './services/auth/auth-interceptor/auth-interceptor.service';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ErrorDialogComponent } from './components/utils/error-dialog/error-dialog.component';
import { TensorflowComponent } from './components/default-images/tensorflow/tensorflow.component';
import { CodeBlockComponent } from './components/utils/code-block/code-block.component';
import { PytorchComponent } from './components/default-images/pytorch/pytorch.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    ProfileComponent,
    ErrorDialogComponent,
    TensorflowComponent,
    CodeBlockComponent,
    PytorchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatTabsModule,
    HighlightModule
  ],
  providers: [
    AuthDataSharingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: <HighlightOptions>{
        lineNumbers: true,
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        //lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        themePath: 'node_modules/highlight.js/styles/github.css',
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
          css: () => import('highlight.js/lib/languages/css'),
          xml: () => import('highlight.js/lib/languages/xml'),
          dockerfile: () => import('highlight.js/lib/languages/dockerfile'),
        },
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

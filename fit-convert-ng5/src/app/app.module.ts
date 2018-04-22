import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule}  from '@angular/material/select';
import { HttpClientModule } from "@angular/common/http";;
import { AppComponent } from './app.component';
import { MatButtonModule, MatMenuModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FileDropModule } from 'ngx-file-drop';

import { ActivityFormComponent } from './activity-form/activity-form.component';
import { ActivityServiceService } from './activity-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ActivityFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileDropModule,
    MatButtonModule, 
    MatMenuModule,
    MatSelectModule
  ],
  providers: [ActivityServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

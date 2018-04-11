import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";;
import { AppComponent } from './app.component';

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
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileDropModule
  ],
  providers: [ActivityServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

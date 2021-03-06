import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule}  from '@angular/material/select';
import { HttpClientModule } from "@angular/common/http";;
import { AppComponent } from './app.component';
import { MatButtonModule, MatMenuModule, MatTabsModule, MatIconModule, MatCardModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [ActivityServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

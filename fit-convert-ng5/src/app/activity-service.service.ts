import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { Activity } from './activity';

@Injectable()
export class ActivityServiceService {

  apiRoot: string = "http://127.0.0.1:8000";
  
  constructor(private _htc:HttpClient) { }

  processActivity(myActivity: Activity) {
    console.log("You used a service!");
    let url = `${this.apiRoot}/process`;
    return this._htc.post(url, myActivity);
  }

  fileUpload(fileItem:File, extraData?:object):any{
      let apiCreateEndpoint = `${this.apiRoot}/process`
      const formData: FormData = new FormData();

      formData.append('fileItem', fileItem, fileItem.name);
      if (extraData) {
        for(let key in extraData){
            // iterate and set other form data
          formData.append(key, extraData[key])
        }
      }

      const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
        reportProgress: true // for progress data
      });
      return this._htc.request(req)
  }

}

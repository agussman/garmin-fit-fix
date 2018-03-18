import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

}

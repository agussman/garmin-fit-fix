import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ActivityServiceService {

  apiRoot: string = "http://127.0.0.1:8000";

  constructor(private _htc:HttpClient) { }

  processActivity():Observable<any> {
    console.log("You used a service!");
    let url = `${this.apiRoot}/`;
    return this._htc.get<any>(url)
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ActivityServiceService {

  constructor(private _htc:HttpClient) { }

  processActivity():Observable<any>

}

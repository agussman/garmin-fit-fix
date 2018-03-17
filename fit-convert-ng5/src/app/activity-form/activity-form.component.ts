import { Component, OnInit } from '@angular/core';

import { Activity } from '../activity';
import { ActivityServiceService } from '../activity-service.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  activityTypes = ['Running', 'Walking', 'Uncategorized'];

  submitted = false;

  // TODO: Missing a 'model =' here
  model = new Activity("", "");

  constructor(private _as:ActivityServiceService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    console.log("You clicked Submit!");
    // TODO: This is an observable, subscribe to it???
    this._as.processActivity().subscribe(res => console.log(res));
    //let url = `${this.apiRoot}/process`;
    //this.http.get(url).subscribe(res => console.log(res.text()));
    //this.http.post(url, JSON.stringify(this.model), {headers: new HttpHeaders({'Content-Type': 'application/json'})} ).subscribe(res => console.log(res.text()));
    console.log("Done with onSubmit");
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}

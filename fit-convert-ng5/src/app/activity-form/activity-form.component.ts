import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Activity } from '../activity';

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
  apiRoot: string = "http://127.0.0.1:8000";

  constructor(private http: Http) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    console.log("You clicked Submit!");
    let url = `${this.apiRoot}/`;
    this.http.get(url).subscribe(res => console.log(res.text()));
    console.log("Done with onSubmit");
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}

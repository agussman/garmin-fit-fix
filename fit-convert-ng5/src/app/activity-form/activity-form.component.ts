import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
  }

  onSubmit() { this.submitted = true; console.log("You clicked Submit!"); }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}

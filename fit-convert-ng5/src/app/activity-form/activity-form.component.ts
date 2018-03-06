import { Component, OnInit } from '@angular/core';
import { Activity } from '../hero';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  activityTypes = ['Running', 'Walking', 'Uncategorized'];

  submitted = false;

  constructor() { }

  ngOnInit() {
  }
  
  onSubmit() { this.submitted = true; }

}

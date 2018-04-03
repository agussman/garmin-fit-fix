import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';

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

  model = new Activity("Default Activity", "Running");

  //statusCreateForm: FormGroup;
  statusFormGroup: FormGroup;
  fileDescription: FormControl;
  fileToUpload: File  = null;
  uploadProgress:number = 0;
  uploadComplete:boolean = false;
  uploadingProgressing:boolean = false;
  fileUploadSub: any;
  serverResponse: any;

  @ViewChild('myInput')
  myFileInput: any;


  constructor(private _as:ActivityServiceService) { }

  ngOnInit() {
    this.fileDescription = new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(280)
    ])

    //this.statusCreateForm = new FormGroup({
    this.statusFormGroup = new FormGroup({
        'fileDescription': this.fileDescription,
    })
  }


  handleProgress(event) {
    console.log("Empty handleProgress for now");
  }

  handleSubmit(event:any, statusNgForm:NgForm, statusFormGroup:FormGroup){
      event.preventDefault()
      if (statusNgForm.submitted){

          let submittedData = statusFormGroup.value

          this.fileUploadSub = this._as.fileUpload(
                this.fileToUpload,
                submittedData).subscribe(
                    event=>this.handleProgress(event),
                    error=>{
                        console.log("Server error")
                    });

          statusNgForm.resetForm({})
      }
  }

      handleFileInput(files: FileList) {
        let fileItem = files.item(0);
        console.log("file input has changed. The file is", fileItem)
        this.fileToUpload = fileItem
    }

    resetFileInput() {
        console.log(this.myFileInput.nativeElement.files);
        this.myFileInput.nativeElement.value = "";
        console.log(this.myFileInput.nativeElement.files);
    }

    handleDownload() {
        console.log("you are doing the file download thing");
    }

  onSubmit() {
    this.submitted = true;
    console.log("You clicked Submit!");
    // TODO: This is an observable, subscribe to it???
    this._as.processActivity(this.model).subscribe(res => console.log(res));
    //let url = `${this.apiRoot}/process`;
    //this.http.get(url).subscribe(res => console.log(res.text()));
    //this.http.post(url, JSON.stringify(this.model), {headers: new HttpHeaders({'Content-Type': 'application/json'})} ).subscribe(res => console.log(res.text()));
    console.log("Done with onSubmit");
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}

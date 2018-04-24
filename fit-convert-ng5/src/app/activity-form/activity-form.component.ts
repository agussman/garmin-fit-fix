import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';

import { saveAs } from 'file-saver/FileSaver';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

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
  pokemonControl: FormControl;
  downloadAvailable: FormControl;
  fileToUpload: File  = null;
  uploadProgress:number = 0;
  uploadComplete:boolean = false;
  uploadingProgressing:boolean = false;
  fileUploadSub: any;
  serverResponse: any = null;
  //fileBlob = new Blob([data], { type: 'text/xml' })

  objectKeys = Object.keys;
  my_menu = {
    'main1': ['sub1', 'sub2'],
    'main2': ['sub1', 'sub2', 'sub3'],
  };
  
  foods = [
    {value: 'Run', viewValue: 'Run', indent:0},
    {value: 'Indoor Run', viewValue: 'Indoor Run', indent:1},
    {value: 'Walk', viewValue: 'Walk', indent:0}
  ];

  getIndent(indent) {
    return 10 + indent*10;
  }
  
  @ViewChild('myInput')
  myFileInput: any;


  constructor(private _as:ActivityServiceService) { }

  ngOnInit() {
    this.fileDescription = new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(280)
    ]);

    this.pokemonControl = new FormControl();

    //this.statusCreateForm = new FormGroup({
    this.statusFormGroup = new FormGroup({
        'fileDescription': this.fileDescription,
        'pokemonControl': this.pokemonControl
    });
  }

  handleProgress(event) {
        if (event.type === HttpEventType.DownloadProgress) {
        //this.uploadingProgressing =true
        //this.uploadProgress = Math.round(100 * event.loaded / event.total)
        console.log("download progress");
      }

      if (event.type === HttpEventType.UploadProgress) {
        //this.uploadingProgressing =true
        //this.uploadProgress = Math.round(100 * event.loaded / event.total)
        console.log("upload?");
      }

      if (event.type === HttpEventType.Response) {
        // console.log(event.body);
        this.uploadComplete = true;
        this.serverResponse = event.body['message'];
        console.log("response!");
        console.log(event.body['message']);
        console.log("again?");
        console.log(this.serverResponse);
      }
  }

  handleSubmit(event:any, statusNgForm:NgForm, statusFormGroup:FormGroup){
      event.preventDefault()
      if (statusNgForm.submitted){

          let submittedData = statusFormGroup.value;

          this.fileUploadSub = this._as.fileUpload(
                this.fileToUpload,
                submittedData).subscribe(
                    event=>this.handleProgress(event),
                    error=>{
                        console.log("Server error")
                    });

          this.resetAllInputs();
          statusNgForm.resetForm({});
          console.log("Actually Done with handleSubmit");
      }
  }

      handleFileInput(files: FileList) {
        let fileItem = files.item(0);
        console.log("file input has changed. The file is", fileItem)
        this.fileToUpload = fileItem
    }

    resetAllInputs() {
        console.log(this.myFileInput.nativeElement.files);
        this.myFileInput.nativeElement.value = "";
        console.log(this.myFileInput.nativeElement.files);
        //statusNgForm.resetForm({});
    }

    handleDownload() {
        console.log("you are doing the file download thing");
        const fileBlob = new Blob([this.serverResponse], { type: 'text/xml' });
        saveAs(fileBlob, "download.xml");
        console.log("guess we're done here?");
    }

  onSubmit() {
    this.submitted = true;
    console.log("You clicked Submit!");
    // TODO: This is an observable, subscribe to it???
    this._as.processActivity(this.model).subscribe(res => console.log(res));
    //this._as.processActivity(this.model).subscribe(res => {
      //console.log(res);
      //console.log("hi");
      //this.handleResponse(res);
    //});
    //let url = `${this.apiRoot}/process`;
    //this.http.get(url).subscribe(res => console.log(res.text()));
    //this.http.post(url, JSON.stringify(this.model), {headers: new HttpHeaders({'Content-Type': 'application/json'})} ).subscribe(res => console.log(res.text()));
    console.log("Done with onSubmit");
  }

  handleResponse(res) {
    //console.log(res);
    console.log("Now do file stuff");
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}

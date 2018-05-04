import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';

import { saveAs } from 'file-saver/FileSaver';

import { Activity } from '../activity';
import { ActivityServiceService } from '../activity-service.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  submitted = false;

  statusFormGroup: FormGroup;
  fileToUpload: File  = null;
  fileUploadSub: any;
  serverResponse: any = null;
  serverFilename: any = null;

  @ViewChild('myInput')
  myFileInput: any;


  constructor(private _as:ActivityServiceService) { }

  ngOnInit() {
    this.statusFormGroup = new FormGroup({
    });
  }

  handleProgress(event) {
      if (event.type === HttpEventType.DownloadProgress) {
        //this.uploadingProgressing =true
        //this.uploadProgress = Math.round(100 * event.loaded / event.total)
        console.log("download...");
      }

      if (event.type === HttpEventType.UploadProgress) {
        //this.uploadingProgressing =true
        //this.uploadProgress = Math.round(100 * event.loaded / event.total)
        console.log("upload...");
      }

      if (event.type === HttpEventType.Response) {
        // console.log(event.body);
        this.uploadComplete = true;
        this.serverResponse = event.body['message'];
        this.serverFilename = event.body['filename'];
        console.log("response!");
        //console.log(event.body['message']);
        console.log(event.body['filename']);
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

    resetAllInputs(statusNgForm:NgForm) {
        console.log(this.myFileInput.nativeElement.files);
        this.myFileInput.nativeElement.value = "";
        console.log(this.myFileInput.nativeElement.files);
        //this.uploadComplete = false;
        statusNgForm.resetForm({});
    }

    handleDownload() {
        console.log("you are doing the file download thing");
        const fileBlob = new Blob([this.serverResponse], { type: 'text/xml' });
        saveAs(fileBlob, this.serverFilename);
        console.log("guess we're done here?");
    }


}

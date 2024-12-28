import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileUpload } from './file-upload';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'https://localhost:7236';
  private cancelSignals: Record<number, Subject<void> | undefined> 
  = {} as Record<number, Subject<void>>; 

  constructor(private http: HttpClient) {}

  upload(fileUpload: FileUpload) {
    const formData = new FormData();
    formData.append('file', fileUpload.file);
    
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  addCancelSignal(fileId: number){
    this.cancelSignals = {...this.cancelSignals, [fileId]: new Subject<void>()}
  }

  getCancelSignal(fileId: number){
    return this.cancelSignals[fileId]
  }

  clearCancelSignal(){
    this.cancelSignals = {} as Record<number, Subject<void>>;
  }
  
}

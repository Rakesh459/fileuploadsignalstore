import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUpload } from './file-upload';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'https://localhost:7236';

  constructor(private http: HttpClient) {}

  upload(fileUpload: FileUpload): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileUpload.file);
    
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}

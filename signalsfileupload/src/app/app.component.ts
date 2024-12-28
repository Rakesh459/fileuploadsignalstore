import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileUploadContainerComponent } from './file-upload-container/file-upload-container.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FileUploadContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'singalsfileupload';
}

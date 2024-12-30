import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadStore } from './fileupload.store';
import { FileUpload } from './file-upload';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-file-upload-container',
  imports: [ReactiveFormsModule, CommonModule],
  providers: [FileUploadStore],
  templateUrl: './file-upload-container.component.html',
  standalone: true,
  styleUrl: './file-upload-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadContainerComponent {
  uploadForm: FormGroup;
  store = inject(FileUploadStore);


  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      files: [[]],
    });
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files as FileList);
    this.uploadForm.patchValue({
      files: files,
    });
  }

  fileUpload() {
    const files: File[] = this.uploadForm.get('files')?.value || [];
    if (files.length === 0) return;

    const fileUploads = files.map((file, index) => ({
      id: index + 1,
      file: file,
      progress: 0
    }));

    this.store.uploadFilesv2(fileUploads);
  }

  cancelUpload(fileId: number) {
    console.log('cancelled', fileId);
    this.store.cancelUpload(fileId);
  }

  trackById(index: number, file: FileUpload){
    return file.id;
  }
}

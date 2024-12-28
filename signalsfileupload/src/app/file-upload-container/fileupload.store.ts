import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { FileUpload } from './file-upload';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HttpEventType } from '@angular/common/http';
import { EMPTY, catchError, finalize, forkJoin, mergeMap, pipe, tap } from 'rxjs';
import { FileUploadService } from './fileupload.service';

type FileUploadState = {
  files: FileUpload[];
  isLoading: boolean;
};

const initialState: FileUploadState = {
  files: [],
  isLoading: false,
};

export const FileUploadStore = signalStore(
  withState(initialState),
  withMethods((store, service = inject(FileUploadService)) => ({
    uploadFiles: rxMethod<FileUpload[]>(
      pipe(
        tap((files) => {
          patchState(store, { 
            isLoading: true,
            files: files 
          });
        }),
        mergeMap((files) => 
          forkJoin(
            files.map(file => 
              service.upload(file).pipe(
                tap((event: any) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    const progress = Math.round(100 * event.loaded / (event.total ?? 1));
                    console.log(progress);
                    patchState(store, (state) => ({
                      files: state.files.map(f => 
                        f.id === file.id ? { ...f, progress } : f
                      )
                    }));
                  }
                }),
                catchError(error => {
                  console.error('Upload failed:', error);
                  return EMPTY;
                })
              )
            )
          )
        ),
        finalize(() => {
          patchState(store, { isLoading: false });
        }),
        catchError(error => {
          console.error('Store error:', error);
          return EMPTY;
        })
      )
    )
  }))
);

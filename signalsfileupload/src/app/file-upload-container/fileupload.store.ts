import { computed, inject, signal } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { FileUpload } from './file-upload';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HttpEventType } from '@angular/common/http';
import { EMPTY, Subject, catchError, from, mergeMap, pipe, tap, takeUntil, finalize } from 'rxjs';
import { FileUploadService } from './fileupload.service';

type FileUploadState = {
  files: FileUpload[];
  isLoading: boolean;
};

const initialState: FileUploadState = {
  files: [],
  isLoading: false
};

export const FileUploadStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
  })),
  withMethods((store, service = inject(FileUploadService)) => ({   
    cancelUpload: (fileId: number) => {
      const signal = service.getCancelSignal(fileId);
      if (signal) {
        signal.next();
        signal.complete();
      }
      
      patchState(store, {
        files: store.files().map(f => 
          f.id === fileId ? { ...f, progress: 0 } : f
        )
      });
    },
    
    uploadFilesv2: rxMethod<FileUpload[]>(
      pipe(
        tap((files) => {
          files.forEach(file => service.addCancelSignal(file.id))          
          patchState(store, { 
            files, 
            isLoading: true
          });
        }),
        mergeMap(files => 
          from(files).pipe(
            mergeMap(file => 
              service.upload(file).pipe(
                tap((event: any) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    const progress = Math.round(100 * event.loaded / (event.total ?? 1));
                    patchState(store, (state) => ({
                      files: state.files.map(f => 
                        f.id === file.id ? { ...f, progress } : f
                      )
                    }));
                  }
                  if (event.type === HttpEventType.Response) {
                    patchState(store, (state) => ({
                      files: state.files.map(f => 
                        f.id === file.id ? { 
                          ...f, 
                          originalName: event.body.originalName, 
                          uploadedName: event.body.fileName 
                        } : f
                      )
                    }));
                  }
                }),
                takeUntil(service.getCancelSignal(file.id) || EMPTY),
                catchError(error => {
                  console.error('Upload failed:', error);
                  return EMPTY;
                })
              )
            )
          )
        ),
        finalize(() => {
          service.clearCancelSignal();
        })
      )
    )
  }))
);

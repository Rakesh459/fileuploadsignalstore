import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadContainerComponent } from './file-upload-container.component';

describe('FileUploadContainerComponent', () => {
  let component: FileUploadContainerComponent;
  let fixture: ComponentFixture<FileUploadContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

export class FileUpload {
    id!: number;
    file!: File
    progress!: number;
    uploadedName?: string;
    originalName?: string;
    status!: string;
}
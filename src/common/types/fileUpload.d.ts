export interface FileUploadOptions {
  destination?: string;
  allowedExtensions?: string[];
  maxFileSize?: number; // in bytes
  fieldName?: string;
}

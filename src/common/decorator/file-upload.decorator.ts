import {
  applyDecorators,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadOptions } from '../types/fileUpload';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const FileUpload = (options: FileUploadOptions = {}) => {
  const {
    destination = './uploads',
    allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'],
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    fieldName = 'file',
  } = options;

  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination,
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          const fileExtension = extname(file.originalname)
            .toLowerCase()
            .slice(1);
          if (!allowedExtensions.includes(fileExtension)) {
            return cb(
              new HttpException(
                `Only ${allowedExtensions.join(', ')} files are allowed!`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
          cb(null, true);
        },
        limits: {
          fileSize: maxFileSize,
        },
      }),
    ),
  );
};

// Specific decorator for profile pictures
export const ProfilePictureUpload = () => {
  return FileUpload({
    destination: './uploads/profile-pictures',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    fieldName: 'file',
  });
};

// Specific decorator for document uploads
export const DocumentUpload = () => {
  return FileUpload({
    destination: './uploads/documents',
    allowedExtensions: ['pdf', 'doc', 'docx', 'txt'],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    fieldName: 'document',
  });
};

// Specific decorator for avatar uploads (smaller size)
export const AvatarUpload = () => {
  return FileUpload({
    destination: './uploads/avatars',
    allowedExtensions: ['jpg', 'jpeg', 'png'],
    maxFileSize: 2 * 1024 * 1024, // 2MB
    fieldName: 'avatar',
  });
};

// Generic image upload decorator
export const ImageUpload = (destination: string = './uploads/images') => {
  return FileUpload({
    destination,
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    maxFileSize: 8 * 1024 * 1024, // 8MB
    fieldName: 'image',
  });
};

// Multiple files upload decorator
export const MultipleFileUpload = (
  options: FileUploadOptions & { maxCount?: number } = {},
) => {
  const {
    destination = './uploads',
    allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'],
    maxFileSize = 5 * 1024 * 1024,
    fieldName = 'files',
    maxCount = 5,
  } = options;

  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination,
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(
              null,
              `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
            );
          },
        }),
        fileFilter: (req, file, cb) => {
          const fileExtension = extname(file.originalname)
            .toLowerCase()
            .slice(1);
          if (!allowedExtensions.includes(fileExtension)) {
            return cb(
              new HttpException(
                `Only ${allowedExtensions.join(', ')} files are allowed!`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            );
          }
          cb(null, true);
        },
        limits: {
          fileSize: maxFileSize,
          files: maxCount,
        },
      }),
    ),
  );
};

import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const uploadRouter = {
  // Define file upload routes
  pdfUploader: f({ pdf: { maxFileSize: '8MB' } })
    .middleware(async () => {
      // Add authentication middleware here
      return { userId: 'user' };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata);
      console.log('File URL:', file.url);
      return { uploadedBy: metadata.userId };
    }),

  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      return { userId: 'user' };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Image upload complete:', file.url);
      return { uploadedBy: metadata.userId };
    }),

  documentUploader: f({
    pdf: { maxFileSize: '8MB' },
    image: { maxFileSize: '4MB' },
  })
    .middleware(async () => {
      return { userId: 'user' };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Document upload complete:', file.url);
      return { uploadedBy: metadata.userId };
    }),
};

export type OurFileRouter = typeof uploadRouter;

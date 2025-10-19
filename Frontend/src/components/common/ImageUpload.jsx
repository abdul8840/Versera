import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onImageChange, currentImage, label, required = false, aspectRatio = null }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onImageChange(acceptedFiles[0]);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="!mb-4">
      <label className="block text-sm font-medium text-gray-700 !mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg !p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {currentImage ? (
          <div className="flex flex-col items-center">
            <img
              src={typeof currentImage === 'string' ? currentImage : URL.createObjectURL(currentImage)}
              alt="Preview"
              className={`max-h-48 rounded-lg !mb-2 ${aspectRatio ? 'object-cover' : ''}`}
              style={aspectRatio ? { aspectRatio } : {}}
            />
            <p className="text-sm text-gray-600">Click or drag to replace image</p>
          </div>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="!mt-1 text-sm text-gray-600">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  uploadedFiles: File[];
}

/**
 * 文件上传组件
 * 支持图片和文档上传
 */
export default function FileUpload({ onFilesChange, uploadedFiles }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 支持的文件类型
  const acceptedTypes = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    documents: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'text/plain',
      'text/markdown',
    ],
  };

  const allAcceptedTypes = [
    ...acceptedTypes.images,
    ...acceptedTypes.documents,
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (!allAcceptedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}（格式不支持）`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name}（超过 10MB）`);
        return;
      }
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      alert(`以下文件无法上传：\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      onFilesChange([...uploadedFiles, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (acceptedTypes.images.includes(type)) {
      return '🖼️';
    }
    if (type === 'application/pdf') {
      return '📄';
    }
    if (type.includes('word') || type.includes('document')) {
      return '📝';
    }
    if (type.includes('excel') || type.includes('spreadsheet')) {
      return '📊';
    }
    if (type.includes('powerpoint') || type.includes('presentation')) {
      return '📽️';
    }
    return '📎';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        上传文件（可选）
        <span className="text-gray-500 text-xs ml-2">
          支持图片、PDF、Word、Excel、PPT、Markdown 等
        </span>
      </label>

      {/* 上传区域 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allAcceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div className="space-y-2">
          <div className="text-4xl">📎</div>
          <div className="text-sm text-gray-600">
            {isDragging ? '松开鼠标上传文件' : '点击或拖拽文件到这里'}
          </div>
          <div className="text-xs text-gray-500">
            支持多文件上传，最大 10MB/文件
          </div>
        </div>
      </div>

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">已上传文件：</div>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">
                    {getFileIcon(file.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-800 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

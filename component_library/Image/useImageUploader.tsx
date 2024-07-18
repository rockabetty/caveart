import { useState, useEffect } from 'react'

type ImageUploaderProps = {
  maxSize: number;
  allowedFileTypes: string[];
  initialSrc: string | File;
  onChange: (files: FileList | undefined) => void; // Updated type
}

const DEFAULT_FILE_TYPES = ['image/jpeg', 'image/gif', 'image/png', 'image/tiff'];

const useImageUploader = ({ maxSize, allowedFileTypes, initialSrc, onChange }: ImageUploaderProps) => {
  const fileTypes = allowedFileTypes || DEFAULT_FILE_TYPES;
  const [fileError, setFileError] = useState<string>("");
  const [files, setFiles] = useState<FileList | undefined>();
  const [img, setImg] = useState<string | File | undefined>(initialSrc);

  useEffect(() => {
    setImg(initialSrc)
    if (initialSrc === undefined) {
      setFiles(undefined)
    }
  },
  [initialSrc]);

  const generatePreview = function(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target
    if (target.files && target.files.length > 0) {
      const file = target.files[0]
      const fsize = Math.round(file.size / 1024)
      if (fsize > maxSize) {
        setFileError(`Files can not exceed ${maxSize} KB`)
        return
      }
      if (!fileTypes.includes(file.type)) {
        setFileError(`You can upload the following types: ${DEFAULT_FILE_TYPES.join(', ')}`)
        return
      }
      setFileError('')
      setFiles(target.files)
      const url = URL.createObjectURL(target.files[0])
      setImg(url)
      if (onChange) {
        onChange(target.files)
      }
    }
  }

  return {
    files,
    img,
    fileError,
    setFileError,
    setFiles,
    generatePreview
  }
}

export default useImageUploader;
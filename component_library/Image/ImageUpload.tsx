import React, { useState, useEffect, useRef } from 'react'
import useImageUploader from './useImageUploader';
import classNames from 'classnames'
import './Image.css'
import '../Form/Form.css'
import Badge from '../Button/Badge'

export interface ImageUploadProps {
  id?: string;
  alt?: string;
  src?: string;
  maxSize?: number;
  editable?: boolean;
  helperText?: string;
  errorText?: string;
  labelText?: string;
  value?: any;
  width?: number;
  height?: number;
  required?: boolean;
  flexible?: boolean;
  name?: boolean;
  onChange?: (newImageUrl: string) => void
}

const ImageUpload = ({
  id = "",
  src = "",
  alt = "",
  labelText = "Upload a new image",
  maxSize = 600,
  editable = false,
  errorText = '',
  helperText = '',
  value = '',
  required = false,
  flexible = false,
  name = '',
  onChange = () => {},
}: ImageUploadProps) => {

  const { img, fileError, setFileError, generatePreview } = useImageUploader({
    maxSize,
    allowedFileTypes: ['image/jpeg', 'image/gif', 'image/png', 'image/tiff'],
    initialSrc: src,
    onChange,
  });

  const [editing, setEditing] = useState<boolean>(false)
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  // Handle custom error text from props
  useEffect(() => {
    if (errorText) {
      setFileError(errorText);
    }
  }, [errorText]);

  // Handle editing state based on file selection
  useEffect(() => {
    setEditing(!!img);
  }, [img]);

  if (editable) {
    return (
      <>
        <div id={id} className={classNames({
          "image" : true,
          "Editable" : true,
          "Flexible": flexible,
          "Error" : !!fileError
        })}>
          <div className="image_overlay">
            <input
              id={`${id}-image-upload`}
              className="image_uploader"
              type="file"
              name={name}
              onChange={generatePreview}
              accept="image/png, image/gif, image/jpg, image/jpeg, image/tiff"
              required={required}
            />
            <label htmlFor={`${id}-image-upload`} className={ editing ? 'image_upload-label Editing' : 'image_upload-label'}>
              <span>{labelText}</span>
            </label>
          </div>

          <img src={img} alt={alt} className="image_image" />
        </div>
        <span className={`form-field_helpertext ${fileError ? 'Error' : ''}`.trim()}>
          {fileError ? fileError : helperText}
        </span>
      </>
    )
  }

  return (
    <div id={id} className={classNames({
      "image" : true,
      "Flexible": flexible
    })}>
      <img src={img} alt={alt} className="image_image" />
    </div>
  )
}

export default ImageUpload
import React, { useState, useEffect, useRef } from 'react'
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
  onChange?: (...params: any) => any
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

  const [files, setFiles] = useState<FileList | undefined>()
  const [img, setImg] = useState<string | undefined>("")
  const [error, setError] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const allowedFileTypes = ['image/jpeg', 'image/gif', 'image/png', 'image/tiff']

  const generatePreview = function(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target
    if (target.files.length > 0) {
      const file = target.files[0]
      const fsize = Math.round(file.size / 1024)
      if (fsize > maxSize) {
        setError(`Files can not exceed ${maxSize} KB`)
        return
      }
      if (!allowedFileTypes.includes(file.type)) {
        setError("You can upload GIFs, JPGs, JPEGs, PNGs and TIFFs.")
        return
      }
      setError('')
      setFiles(target.files)
      const url = URL.createObjectURL(target.files[0])
      setImg(url)
      if (onChange) {
        onChange(url)
      }
    }
  }

  // The component validates itself, but if some custom context means we need to pass down an error...
  useEffect(() => {
    setError(errorText)
  }, [errorText])

  useEffect(() => {
    setEditing(!!files)
  }, [files])

  useEffect(() => {
    setImg(src || defaultImageSrc)
    if (src === undefined) {
      setFiles(undefined)
    }
  },
  [src])

  if (editable) {
    return (
      <>
        <div id={id} className={classNames({
          "image" : true,
          "Editable" : true,
          "Flexible": flexible,
          "Error" : !!error
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
        <span className={`form-field_helpertext ${error ? 'Error' : ''}`.trim()}>
          {error ? error : helperText}
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
import React from 'react'
import WriteInField, {WriteInFieldProps, writeInDefaults} from './atoms/WriteInField'

const TextArea: React.FC<WriteInFieldProps> = (props) => {
  const {type} = props

  return(
    <WriteInField {...props} type={type} />
  )
}

TextArea.defaultProps = writeInDefaults;

export default TextArea;
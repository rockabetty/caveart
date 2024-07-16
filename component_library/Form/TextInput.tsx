


import React, {useRef, useImperativeHandle, forwardRef} from 'react'
import WriteInField, {WriteInFieldProps, writeInDefaults} from './atoms/WriteInField'

const TextInput: React.FC<WriteInFieldProps> = forwardRef((props, ref) => {
  const {type} = props
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      internalRef.current?.focus();
    },
    scrollIntoView() {
      internalRef.current?.scrollIntoView();
    },
    validate() {
      return internalRef.current?.validate();
    },
  }));

  return(
    <WriteInField ref={inputRef} {...props} type={type} />
  )
},[]);

TextInput.defaultProps = writeInDefaults;

export default TextInput;
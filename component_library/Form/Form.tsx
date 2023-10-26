import React, {useState} from 'react'
import axios from 'axios'
import './Form.css'
import {InteractiveProps, InteractiveDefaults} from '../types/universal'

export interface FormProps extends InteractiveProps {  
  /**
   * API endpoint to post to
  */
  postTo?: string;
  /**
   * Function to call if post request is successful
  */
  onSuccess: (...params: any) => any;
  /**
   * Funciton to call if post request fails
  */
  onFailure: (...params: any) => any;
}

export const formDefaults: FormProps = {
  ...InteractiveDefaults,
  postTo: ''
} as FormProps

const Form: React.FC<FormProps> = (props) => {
  const {
    children,
    id,
    postTo,
    onFailure,
    onSuccess
  } = props

  const [formValues, setFormValues] = useState({"name": "Jim"})

  function handleChange (e) {
    setFormValues({...formValues, [e.target.name]: e.target.value})
  }

  function handleSubmit (e): null {
    e.preventDefault()
    const form = document.querySelector(`#${id}`)
    const errorCount = form.getElementsByClassName('Error').length
    if (errorCount === 0) {
      axios({
        method: 'post',
        url: postTo
      })
        .then((res) => {
          onSuccess(res)
        })
        .catch((err) => {
          onFailure(err)
        })
    }
  }

  const inputTypes = ['text']

  const patchedChildren = React.useMemo(() => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (inputTypes.includes(child.props.type)) {
          const name = child.props.name
          const extendedChild = React.cloneElement(child, {
            onChange: handleChange,
            value: formValues.name
          })
          return extendedChild
        } else {
          return child
        }
      }
    })
  }, [formValues])

  return(
    <form
      id={id}
      className="form"
      noValidate
      onSubmit={handleSubmit}
    >
      {patchedChildren}
    </form>
  )
}

Form.defaultProps = formDefaults

export default Form
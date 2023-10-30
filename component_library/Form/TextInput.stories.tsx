import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import TextInput from './TextInput'
import Link from '../Link/Link'
export default {
  title: 'Components/TextInput',
  component: TextInput,
  argTypes: {
    defaultValue: {
      control: { type: 'text' }
    },
    type: { 
      control: { type: 'select' }
    }
  }
} as ComponentMeta<typeof TextInput>

const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />

export const Default = Template.bind({})
Default.args = {
  id: "example-id",
  labelText: "Form Field",
  helperText: "Optional helper text goes here.",
  defaultValue: "Default Value",
  type: "text",
  value: "Jimbo"
}
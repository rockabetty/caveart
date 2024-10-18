import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import TabGroup from './TabGroup'
export default {
  title: 'General/Tabgroup',
  component: TabGroup,
} as ComponentMeta<typeof Tab>

const Template: ComponentStory<typeof Tab> = (args) => <TabGroup {...args} />

export const Default = Template.bind({})
Default.args = {
  id: "example-id",
  tabs: ["foo", "bar", "baz"]
}
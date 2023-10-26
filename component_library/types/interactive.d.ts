import {UniversalProps, UniversalDefaults} from './universal'

export interface InteractiveProps extends UniversalProps {
    /**
     * Define a string value that labels an interactive element.
     * Not necessary if there is already an actual label element.
    */
    ariaLabel?: string;
    /**
    * The ID of the element (or elements) that label the element it is applied to.
    * Not necessary if there is already an actual lable in the element.
    */
    ariaLabelledby?: string;
    /**
     * Designate an interactive element as disabled
    */
    disabled?: boolean;
    /**
    * Determine behavior when the user no longer focuses on the element
    */
    onBlur: (...params: any) => any;
    /**
     * Determine behavior when user clicks on the element
     */
    onClick: (...params: any) => any;
    /**
    * Determine behavior when the user focuses on the element
    */
    onFocus: (...params: any) => any;

}

export const InteractiveDefaults = {
  ...UniversalDefaults,
  ariaLabel: "",
  ariaLabelledby: "",
  disabled: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBlur: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFocus: () => {},
} as InteractiveProps



export interface UniversalProps {
  /**
  * Specify the unique ID of the input
  **/
  id?: string;
  /** 
  * Optional additional styling
  */
  classes?: string;
}

export const UniversalDefaults = {
  id: "",
  classes: ""
} as UniversalProps

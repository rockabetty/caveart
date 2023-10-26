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

export const applyMixins = (baseClass: any, extendedClasses: any[]) => {
  extendedClasses.forEach(extendedClass => {
    Object.getOwnPropertyNames(extendedClass.prototype).forEach(name => {
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null)
      )
    })
  })
}
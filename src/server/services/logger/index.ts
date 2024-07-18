export const logger = {
    info: (message: string ) => {
      console.log(message)
    },
    log: (message: string ) => {
      console.log(message)
    },
    warn: (message: string ) => {
      console.log(message)
    },
    error: (error: Error) => {
      console.log(error)
    }
}

export default logger;
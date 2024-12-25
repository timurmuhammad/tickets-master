import { useState } from "react"

export const getLocalStorageData = (key, initialValue) => {
  try {
    const value = window?.localStorage.getItem(key)
    // Check if the local storage already has any values,
    // otherwise initialize it with the passed initialValue
    return value ? JSON.parse(value) : initialValue
  } catch (error) {
    console.error(error)
    return initialValue
  }
}

const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(getLocalStorageData(key, initialValue))

  const setValue = value => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore = value instanceof Function ? value(state) : value
      window?.localStorage.setItem(key, JSON.stringify(valueToStore))
      setState(value)
    } catch (error) {
      console.error(error)
    }
  }

  return [state, setValue]
}

export default useLocalStorage
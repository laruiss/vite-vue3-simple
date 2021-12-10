import store from '@/store/index.js'

function displayWarning (message) {
  store.dispatch('setMessage', {
    message,
    type: 'warning',
  })
}

export function validate (validator, message) {
  return data => {
    const isValid = validator(data)
    if (!isValid) {
      displayWarning(message)
    }
    return isValid
  }
}

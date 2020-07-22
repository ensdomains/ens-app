import { getNetworkId } from '@ensdomains/ui'
const ProgressStore = {
  get: label => {
    return window.localStorage.getItem('progress')
      ? JSON.parse(window.localStorage.getItem('progress'))[label]
      : null
  },
  set: (label, obj) => {
    let data = {}
    let progress
    if ((progress = window.localStorage.getItem('progress'))) {
      data = JSON.parse(progress)
    }
    data[label] = obj
    window.localStorage.setItem('progress', JSON.stringify(data))
  },
  // Get rid of all names in progress
  remove: () => {
    window.localStorage.removeItem('progress')
  }
}

export default ProgressStore

import { UPDATE_RESTART_MSG } from '../utils/constants'

const { ipcRenderer } = require('electron')

const notification = document.querySelector('.header-container__update-notification')
const message = document.getElementById('message')

ipcRenderer.on('updateDownloaded', (_event, info) => {
  const restartButton = document.getElementById('restart-button')
  if (message) message.innerText = UPDATE_RESTART_MSG
  localStorage.version = info.version
  restartButton.classList.remove('hidden')
  notification.classList.remove('hidden')
})

ipcRenderer.on('message', (_event, msg) => {
  if (message) message.innerText = msg
  if (notification) notification.classList.remove('hidden')
})

const closeNotification = () => notification.classList.add('hidden')

export default closeNotification

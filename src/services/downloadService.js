import { UPDATE_RESTART_MSG } from '../utils/constants'

const { ipcRenderer } = require('electron')

ipcRenderer.on('updateDownloaded', (_event, info) => {
  const notification = document.getElementById('notification')
  const message = document.getElementById('message')
  const restartButton = document.getElementById('restart-button')
  if (message) message.innerText = UPDATE_RESTART_MSG
  restartButton.classList.remove('hidden')
  localStorage.version = info.version
  notification.parentElement.parentElement.parentElement.classList.remove('hidden')
})

ipcRenderer.on('message', (_event, msg) => {
  const notification = document.getElementById('notification')
  const message = document.getElementById('message')
  if (message) message.innerText = msg
  if (notification) notification.parentElement.parentElement.parentElement.classList.remove('hidden')
})

const closeNotification = () => {
  const n = document.getElementById('notification')
  n.parentElement.parentElement.parentElement.classList.add('hidden')
}

export default closeNotification

import 'github-markdown-css'
import React, { useEffect, useState } from 'react'

import {
  Icon,
  PrimaryButton, ProgressIndicator, Separator, Stack, Text,
} from 'office-ui-fabric-react'

import { editUpdateInfo, getUpdateInfo } from '../../../services/dbService'
import { restartApp } from '../../../services/nodeService'
import { getReadableSize } from '../../../utils/utils'
import '../index.scss'

const { ipcRenderer } = require('electron')

const DownloadSection = () => {
  const [upGress, setUpdateProgress] = useState(getUpdateInfo()?.progress ?? '')
  const [updateInfo, setUpdateInfo] = useState(getUpdateInfo()?.info ?? '')
  const [newVersion, setNewVersion] = useState(getUpdateInfo()?.info?.version ?? ' ')

  useEffect(() => {
    const progressHandler = (_e, progress) => {
      const snapshot = {
        ...progress,
        transferred: getReadableSize(progress.transferred),
        total: getReadableSize(progress.total),
        speed: getReadableSize(progress.bytesPerSecond, true),
      }
      setUpdateProgress(snapshot)
      editUpdateInfo(snapshot, 'progress')
    }
    ipcRenderer.on('update:progress', progressHandler)
    return () => ipcRenderer.removeListener('update:progress', progressHandler)
  }, [])

  useEffect(() => {
    const downloadedHandler = (_e, info) => {
      setUpdateInfo(info)
      editUpdateInfo(info, 'info')
      setNewVersion(`v${info.version} `)
    }
    ipcRenderer.on('update:downloaded', downloadedHandler)
    return () => ipcRenderer.removeListener('update:downloaded', downloadedHandler)
  }, [upGress])

  return (
    <>
      { (
        <>
          <Stack>
            <Separator className="separator-stack">
              Downloads
              <Icon
                iconName="CloudDownload"
                className="separator-stack__icon"
              />
            </Separator>
          </Stack>
          <br />
          <div className="update-card">
            {!(upGress || updateInfo) && (
              <>
                <Text>
                  Your application is up to date!
                  {' '}
                  <span
                    role="img"
                    aria-label="cheers"
                  >
                    🥂
                  </span>
                  <br />
                  Hey! We are working hard to push next update.
                  {' '}
                  <span
                    role="img"
                    aria-label="hard-work"
                  >
                    💪🏻
                  </span>
                  Thanks for checking!
                  <span
                    role="img"
                    aria-label="Thanks"
                  >
                    🙌🏻
                  </span>
                </Text>
              </>
            )}
            {upGress && (
              <>
                <ProgressIndicator
                  label={`${upGress.percent === 100
                    ? `${`🥳 ${newVersion}Update Downloaded`}`
                    : 'Downloading Update ⏬'}`}
                  description={`📦 ${upGress.transferred}/${upGress.total} 🚀 (${upGress.speed}) `}
                  percentComplete={upGress.percent / 100}
                />
                <br />
              </>
            )}
            {updateInfo && (
              <div>
                <PrimaryButton
                  iconProps={{ iconName: 'Rerun' }}
                  text="Restart & Apply Update"
                  onClick={restartApp}
                />
                <br />
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default DownloadSection

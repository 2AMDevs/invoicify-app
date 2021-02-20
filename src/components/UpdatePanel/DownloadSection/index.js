import 'github-markdown-css'
import React, { useEffect, useState } from 'react'

import {
  Icon,
  PrimaryButton, ProgressIndicator, Separator, Stack,
} from 'office-ui-fabric-react'

import { editUpdateInfo, getUpdateInfo } from '../../../services/dbService'
import { restartApp } from '../../../services/nodeService'
import { getReadableSize } from '../../../utils/utils'
import '../index.scss'

const { ipcRenderer } = require('electron')

const DownloadSection = () => {
  const [upGress, setUpdateProgress] = useState(getUpdateInfo()?.progress ?? '')
  const [updateInfo, setUpdateInfo] = useState(getUpdateInfo()?.info ?? '')

  useEffect(() => {
    // const interval = setInterval(() => {
    ipcRenderer.on('updateProgress', (_e, progress) => {
      const snapshot = {
        ...progress,
        transferred: getReadableSize(progress.transferred),
        total: getReadableSize(progress.total),
        speed: getReadableSize(progress.bytesPerSecond, true),
      }
      setUpdateProgress(snapshot)
      editUpdateInfo(snapshot, 'progress')
    })
    // }, 1000)
    // return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    ipcRenderer.on('updateDownloaded', (_e, info) => {
      setUpdateInfo(info)
      editUpdateInfo(info, 'info')
    })
  }, [upGress])

  return (
    <>
      {(upGress || updateInfo) ? (
        <>
          <br />
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
            {upGress && (
              <>
                <ProgressIndicator
                  label={`${upGress.percent === 100
                    ? `${`🥳 v${updateInfo.version} Update Downloaded`}`
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
              </div>
            )}
          </div>
          <br />
        </>
      ) : <></>}
    </>
  )
}

export default DownloadSection

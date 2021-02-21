import 'github-markdown-css'
import React from 'react'

import { Icon, Separator, Stack } from 'office-ui-fabric-react'

import DownloadSection from './DownloadSection'
import './index.scss'
import ReleaseNotes from './ReleaseNotes'

const UpdatesPanel = ({ tag }) => (
  <>
    <DownloadSection />
    <Stack>
      <Separator className="separator-stack">
        Release Notes
        <Icon
          iconName="ProductRelease"
          className="separator-stack__icon"
        />
      </Separator>
    </Stack>
    <br />
    <ReleaseNotes tag={tag} />
  </>
)

export default UpdatesPanel

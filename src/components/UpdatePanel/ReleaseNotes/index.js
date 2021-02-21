import 'github-markdown-css'
import React, { useEffect, useState } from 'react'

import { Spinner, SpinnerSize } from 'office-ui-fabric-react'
import ReactMarkdown from 'react-markdown'
import '../index.scss'

const ReleaseNotes = ({ tag }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getData = async () => {
      const data = await fetch(`https://api.aashutosh.dev/invoicify-release/${tag}`)
      const jsonData = await data.json()
      // this is trick to get newline, yeah!
      jsonData.body.replace(/\r/gi, '  ')
      setNotes([jsonData])
      setLoading(false)
    }

    getData()
  }, [tag])

  if (loading) {
    return (

      <div className="full-height">
        <Spinner
          size={SpinnerSize.large}
        />
      </div>
    )
  }

  return (
    <div className="release-notes">
      <div className="update-card">
        {(notes?.map((release) => (
          <div
            key={release.node_id}
            className="markdown-body"
          >
            <ReactMarkdown allowDangerousHtml>
              {release.body}
            </ReactMarkdown>
            <br />
          </div>
        )))}
      </div>
    </div>
  )
}

export default ReleaseNotes

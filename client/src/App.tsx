import { useState } from 'react'
import './App.css'
import { Media } from './types'
import LinkSubmitForm from './components/LinkSubmitForm'
import MediaGrid from './components/MediaGrid'

const App = () => {
  const [medias, setMedias] = useState<Media[]>([])

  return (
    <>
      <header>
        <h1>
          <a href='/'>GetInstaMedia</a>
        </h1>
      </header>
      <main>
        <LinkSubmitForm setMedias={setMedias} />
        <div>
          <MediaGrid medias={medias} />
        </div>
      </main>
      <footer>
        <p>Author of this website is not affiliated with Instagram or Meta.</p>
      </footer>
    </>
  )
}

export default App

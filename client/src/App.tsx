import { useState } from 'react'
import { IGItemData } from './types'
import Header from './components/Header'
import LinkSubmitForm from './components/LinkSubmitForm'
import MediaGrid from './components/MediaGrid'
import Footer from './components/Footer'

const App = (): JSX.Element => {
  const [items, setItems] = useState<IGItemData[]>([])

  return (
    <>
      <Header />
      <main>
        <LinkSubmitForm setItems={setItems} />
        <MediaGrid items={items} />
      </main>
      <Footer />
    </>
  )
}

export default App

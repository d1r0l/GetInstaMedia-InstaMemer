import './App.css'

function App() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`submitted "${e.currentTarget.link.value}"`)
  }

  return (
    <>
      <h1>sm_downloader</h1>
      <div>
        <form action='download' method='post' onSubmit={handleSubmit}>
          <input type='text' name='link' size={100} />
          <input type='submit' value='Download' />
        </form>
      </div>
    </>
  )
}

export default App

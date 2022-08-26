import { Button } from '@mui/material'
import { useState } from 'react'
import './App.css'

import EventForm from './components/event-form'
import Results from './components/results'

function App() {
  const [results, setResults] = useState<Record<string,any> | null>(null)

  return (
    <div className="App">
      {results 
        ? <>
          <Results results={results} />
          <Button className='form-btn' variant='outlined' color="inherit" onClick={() => { setResults(null) }}>Create new event</Button>
          </>
        : <EventForm setResults={setResults} />}
    </div>
  )
}

export default App

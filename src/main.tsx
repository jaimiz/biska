import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './App.tsx'
import './global.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)

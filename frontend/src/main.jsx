import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './Store/store.js'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './services/socketService.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store = {store}>
      <SocketProvider serverUrl = "http://localhost:8080">
    <App />
      </SocketProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>
)

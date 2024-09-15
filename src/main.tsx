import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { Provider } from 'react-redux'
import store from './store.ts'
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="pb-2 text-center">
      <h1 className='text-xl font-bold'>Network Planning</h1>
      <p className='text-xs'>Designed by Sniper7Kills LLC &copy; 2024</p>
    </div>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster />
  </StrictMode>,
)

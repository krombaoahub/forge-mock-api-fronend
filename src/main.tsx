import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import { AuthProvider } from '@/context/AuthContext.tsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext.tsx'
import { Provider } from 'react-redux'
import { store } from '@/states/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <AuthProvider>
          <Router>
            <App />
          </Router>
        </AuthProvider>
      </AppProvider>
    </Provider>
  </StrictMode>,
)

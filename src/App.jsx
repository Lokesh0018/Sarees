import { StoreProvider } from './context/StoreContext'
import SiteLayout from './layouts/SiteLayout'
import Home from './pages/Home'

export default function App() {
  return (
    <StoreProvider>
      <SiteLayout>
        <Home />
      </SiteLayout>
    </StoreProvider>
  )
}

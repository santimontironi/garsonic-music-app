import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import Home from "./pages/Home.tsx"
import ArtistPanel from "./pages/ArtistPanel.tsx"
import ConfirmAccount from "./pages/ConfirmAccount.tsx"
import UserPanel from "./pages/UserPanel.tsx"
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from "./queryClient.ts"
import VerifyRole from "./components/auth/VerifyRole.tsx"

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ingreso" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/confirmar-cuenta/:token" element={<ConfirmAccount />} />
          <Route path="/panel-artista" element={ <VerifyRole allowed={["ARTIST"]}><ArtistPanel /></VerifyRole>} />
          <Route path="/panel-usuario" element={ <VerifyRole allowed={["USER"]}><UserPanel /></VerifyRole>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login.tsx"
import Home from "./pages/Home.tsx"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingreso" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login.tsx"
import Register from "./pages/Register.tsx"
import Home from "./pages/Home.tsx"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingreso" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
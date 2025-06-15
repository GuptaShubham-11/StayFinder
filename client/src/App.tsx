import { Route, Routes } from "react-router-dom"
import { Signin, Signup } from "./components"

function App() {

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  )
}

export default App

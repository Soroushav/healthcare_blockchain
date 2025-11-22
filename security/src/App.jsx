
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Dashboard
 from "./pages/Dashboard";
 import Request
 from "./pages/Request";
import Certifications from "./pages/Certifications";
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <AppLayout/>
            }
          >
            <Route
              index
              element={<Navigate replace to="dashboard"></Navigate>}
            ></Route>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="request" element={<Request/>}/>
            <Route path="certifications" element={<Certifications/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
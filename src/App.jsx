
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Dashboard
 from "./pages/Dashboard";
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
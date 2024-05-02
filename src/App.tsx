import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './components/routes/Layout/Layout'
import Register from './components/routes/Register/Register'
import Login from './components/routes/Login/Login'
import Home from './components/routes/Home/Home'
import ProtectProfile from './components/routes/ProtectRoutes/ProtectProfile'
import ProtectAuth from './components/routes/ProtectRoutes/ProtectAuth'

function App() {
  const routes = createBrowserRouter([
    {path: "", element: <Layout/>, children: [
      {index: true, element: <ProtectProfile><Home/></ProtectProfile>},
      {path: "register", element: <ProtectAuth><Register/></ProtectAuth>},
      {path: "login", element: <ProtectAuth><Login/></ProtectAuth>}
    ]}
  ])

  return <RouterProvider router={routes}></RouterProvider>
}

export default App

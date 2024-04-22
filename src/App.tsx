import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './components/routes/Layout/Layout'
import Register from './components/routes/Register/Register'
import Login from './components/Login/Login'

function App() {
  const routes = createBrowserRouter([
    {path: "", element: <Layout/>, children: [
      {path: "register", element: <Register/>},
      {path: "login", element: <Login/>}
    ]}
  ])
  return <RouterProvider router={routes}></RouterProvider>
}

export default App

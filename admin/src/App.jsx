import {React} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'

const PrivateRoute = ({ authenticated }) => {
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

const App = () => {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} ></Route>
        <Route exact path="/login" element={<Login />} ></Route>
        <Route exact path="/user/sign-in" element={<Register />} ></Route>
        <Route element={<PrivateRoute authenticated={isAuthenticated} />}>
          <Route exact path="/dashboard" element={<Home />} ></Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
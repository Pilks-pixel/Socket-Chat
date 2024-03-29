import { Routes, Route } from 'react-router-dom';
import {Home, Login, Register, Profile} from './pages'
import {PrivateRoute, PublicRoutes} from './components'
import './index.css';

function App() {
  


  return (
    <div className='h-screen'>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<PublicRoutes/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
      </Routes>
    </div>
     
  );
}

export default App;

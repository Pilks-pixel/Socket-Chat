import { Routes, Route } from 'react-router-dom';
import {Home, Login, Register, SetAvatar} from './pages'
import {PrivateRoute, PublicRoutes} from './components'
import './App.css';

function App() {
  


  return (
    <div className="App">
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/avatar" element={<SetAvatar />} />
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

import { Routes, Route } from 'react-router-dom';
import {Home, Login, Register, SetAvatar} from './pages'
import './App.css';
// import io from "socket.io-client";
// import ChatIput from './components/ChatInput';
// const socket = io.connect("http://localhost:5001");
import PrivateRoute from './components/PrivateRoute';
import PublicRoutes from './components/PublicRoutes';

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

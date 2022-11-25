import { Routes, Route } from 'react-router-dom';
import {Home, Login, Register} from './pages'
import './App.css';
// import io from "socket.io-client";
// import ChatIput from './components/ChatInput';
// const socket = io.connect("http://localhost:5001");

function App() {


  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
    </div>
     
  );
}

export default App;

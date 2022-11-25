import { Routes, Route } from 'react-router-dom';
import {Home} from './pages'
import './App.css';
// import io from "socket.io-client";
// import ChatIput from './components/ChatInput';
// const socket = io.connect("http://localhost:5001");

function App() {


  return (
    <Routes>
      <div className="App">
        <Route path="/" element={<Home />} />
      </div>
    </Routes>
     
  );
}

export default App;

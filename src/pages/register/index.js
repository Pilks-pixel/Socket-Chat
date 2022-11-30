import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import './register.css';
import { registerRoute } from '../../utils/apiRoutes';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// const axios = require('axios');
import axios from 'axios';


function Register() {

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    
    const handleRegisterInput = (e) => {
      const {name, value} = e.target;
      setUser({
      ...user,
      [name] : value,
      })
      
    };

    const goTo = useNavigate();

    // Toast notification settings

    const toastWarning = {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
        }

    const toastSucess = {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
        }    
    
        const handleSubmit = async (e) => {
            e.preventDefault(); 
            
            if (handleUserValidation()) {
                const {username, email, password
                } = user;
                try {
                    const resp = await axios.post(registerRoute, {
                        username: username,
                        email: email,
                        password: password
                    });
                    
                    // console.log(resp.data)
                    if(resp.data.status === true) {
                        toast.success('Account created!', toastSucess);
                        localStorage.setItem("chat-app-user", JSON.stringify(resp.data.user))
                        goTo("/")

                    } else if(resp.data.status === false) {
                       throw toast.warn(resp.data.msg, toastWarning);

                    }


                    } catch (err) {
                        console.error(err);
                        
                        
                        }
            }
        }

        const handleUserValidation = () => {
            
        if (user.password !== user.confirmPassword) {
            toast.warn('passwords must match!', toastWarning);
            return false;      
            
        } else if (user.username.length < 3) {
            toast.warn('username must be at least 3 characters long', toastWarning);
            return false;      
            
        } else if (user.password.length < 6) {
            toast.warn('password must be at least 6 characters long', toastWarning);
            return false;      

        } else {
          return true  
        }
    };

      


  return (
    <div className="container-register">
        

        <h3>register</h3>

        <form onSubmit={handleSubmit} className="container-register-form">
            <input 
            type="text" 
            placeholder="name" 
            value={user.username}
            name="username" 
            onChange={handleRegisterInput}
            />

            <input 
            type="email" 
            placeholder="email" 
            value={user.email}
            name="email" 
            onChange={handleRegisterInput}
            />

            <input 
            type="password" 
            placeholder="password" 
            value={user.password} 
            name="password" 
            onChange={handleRegisterInput}
            />

            <input 
            type="password" 
            placeholder="confirm password" 
            value={user.confirmPassword} 
            name="confirmPassword" 
            onChange={handleRegisterInput}
            />

            <input type="submit" value="Register"/>
        </form>

        <span>Already have an account?</span>
        <Link to='/login'>Login</Link>

        <ToastContainer />


    </div>
  )
}
export default Register
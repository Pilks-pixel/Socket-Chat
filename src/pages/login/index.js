import {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import '../register/register.css';
import { loginRoute } from '../../utils/apiRoutes';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


function Login(props) {

    const [user, setUser] = useState({
        username: "",
        password: "",
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



    
    // Form submission & validation
    const handleSubmit = async (e) => {
        e.preventDefault(); 
            
        if (handleUserValidation()) {
            const {username, password
            } = user;
            try {
                const resp = await axios.post(loginRoute, {
                    username: username,
                    password: password
                });
                    
                // console.log(resp.data)
                if(resp.data.status === true && resp.data.accessToken) {
                    toast.success('Login Sucessful', toastSucess);
                    localStorage.setItem('jwtToken', JSON.stringify(resp.data))
                    axios.defaults.headers.common['Authorization'] = 'Bearer' + resp.data.accessToken
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
      if (user.password === '' || user.username === '') {
        toast.warn('must enter valid input', toastWarning);
        return false;      
            
      } else {
          return true  
        }
    };

      
  return (
    <div className="container-register">
        

        <h3>login</h3>

        <form onSubmit={handleSubmit} className="container-register-form">
            <input 
            type="text" 
            placeholder="name" 
            value={user.username}
            name="username" 
            onChange={handleRegisterInput}
            />

            <input 
            type="password" 
            placeholder="password" 
            value={user.password} 
            name="password" 
            onChange={handleRegisterInput}
            />

            <input type="submit" value="Login"/>
        </form>



      <span>Don't have an account?</span>
      <Link to='/register'>Register</Link>


        <ToastContainer />


    </div>
  )
}
export default Login

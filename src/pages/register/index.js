import {useState} from 'react'
import { Link } from 'react-router-dom';
import '../../App.css';
import './register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Register() {

    const [user, setUser] = useState({
        userName: "",
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

    const handleUserValidation = (e) => {
        e.preventDefault()
        if (user.password === user.confirmPassword) {
            console.log(user)
            toast.success('Account created!', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            
            // async function createUser() {
            //     try {
            //     //   let resp = await axios.post("", {
            //     //     userName: user.userName,
            //     //     email: user.email,
            //     //     password: user.password
            //     //   });
            //     //   console.log(resp.data)
            //     //   console.log(resp)
            //     }
            //     catch (err) {
            //       console.error(err);
            //     }
            //   }
            
        } else {
            toast.warn('passwords must match!', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            
        }
    };

      


  return (
    <div className="container-register">
        

        <h3>register</h3>

        <form onSubmit={handleUserValidation} className="container-register-form">
            <input 
            type="text" 
            placeholder="name" 
            value={user.userName}
            name="userName" 
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
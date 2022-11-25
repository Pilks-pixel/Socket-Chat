import {useState} from 'react'



function Register() {

    const [user, setUser] = useState({
        userName: "",
        password: ""
    });
    
    const handleRegisterInput = (e) => {
      const {name, value} = e.target;
      setUser({
      ...user,
      [name] : value,
      })
      
    };

    const registerUser = () => {

    }
      


  return (
    <div>
        

        <h3>register</h3>

        <form onSubmit={registerUser} className="container-register-form">
            <input 
            type="text" 
            placeholder="name" 
            value={user.userName}
            name="userName" 
            onChange={handleRegisterInput}
            />

            <input 
            type="password" 
            placeholder="password" 
            value={user.password} 
            name="password" 
            onChange={handleRegisterInput}/>

            <input type="submit" value="Register"/>
        </form>

    </div>
  )
}

export default Register
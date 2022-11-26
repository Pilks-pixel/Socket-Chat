import React from 'react'
import {Link} from 'react-router-dom'

function Login() {
  return (
    <div>
      <h4>Login</h4>

      <span>Don't have an account?</span>
      <Link to='/register'>Register</Link>
    </div>
    
  )
}

export default Login


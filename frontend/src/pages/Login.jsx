import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../css/form.css';


export default function Login() {
  const { updateLoginInfo,
    loginError,
    loginInfo,
    isLoginLoading,
    loginUser } = useContext(AuthContext)
  
  return (
    <div className='login-form'>
    <div className='row'>
  <div className='col-2'></div>
      <div className='col-8'>
        <h1 className='h1-form'>Login </h1>
        <form onSubmit={loginUser} >
          <input type="email" className='loginregisterinput' name="email" placeholder='enter your email ..'  required
          onChange={(e)=>updateLoginInfo({...loginInfo, 'email':e.target.value})} id="email"/><br/><br/>
          <input type="password" className='loginregisterinput' name="password" placeholder='enter password ..' 
          onChange={(e)=>updateLoginInfo({...loginInfo, 'password':e.target.value})} required />
        <br />
        <button id='loginbutton' type="submit">
        {isLoginLoading?'Getting you in ...' :'login'}</button>
        </form>

        {
          loginError?.error && 
          <div className='alert alert-danger'>
            {loginError?.message}
        </div>
        }
      </div>
      <div className='col-2'></div>
        
      </div>
    </div>
    
  )
}

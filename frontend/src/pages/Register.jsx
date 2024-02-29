import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../css/form.css'

export default function Register() {
    const { registerInfo, updateRegisterInfo, registerUser,registerError , isRegisterLoading }= useContext(AuthContext)
  return (
    <div className='register-form'>
      
      <div className='row'>
      <div className='col-2'></div>
      <div className='col-8'>
      <h1 className='h1-form'>Register</h1>
        <form onSubmit={registerUser}>
                <input type='text' className='loginregisterinput' name='name' placeholder='enter your name ...' onChange={(e)=>updateRegisterInfo({
                    ...registerInfo, 'name': e.target.value
                })}/>
                    <br />
                    <br />
                <input type='email' className='loginregisterinput' name='email' placeholder='enter your email ...' onChange={(e)=>updateRegisterInfo({
                    ...registerInfo, 'email':e.target.value
                })}/>
                    <br />
                    <br />
                <input type='password' className='loginregisterinput' name='password' placeholder='enter password ...' onChange={(e)=>updateRegisterInfo({
                    ...registerInfo, 'password':e.target.value
                })}/>
                    <br />
                    <br />
                <button id='registerbutton' type='submit' className='btn btn-success'>
                {isRegisterLoading?'creating your account':'register'}
                </button>
              </form>
              {registerError &&<div className='alert alert-danger'> {registerError?.message} </div>}
              
      </div>
      <div className='col-2'></div>
      </div>
      
      {/* display any errors that occured during registration */}
      
    </div>
  )
}

import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../css/navbar.css';
import Notification from './Notification';

export default function NavBar() {
  const { user, logoutUser }= useContext(AuthContext)

  return (<>
    <nav class="navbar navbar-expand-lg ">
  <Link to='/' class="navbar-brand" href="#"><div id='logo'>Home</div></Link>
  <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarText">
    <ul class="navbar-nav mr-auto">
    {
         !user && (
            <>
      <li class="nav-item">
        <Link to='/login' class="nav-link" data-toggle="tooltip" data-placement="bottom" title="Login">Login</Link>
      </li>
      <li class="nav-item">
        <Link to='/register' class="nav-link" data-toggle="tooltip" data-placement="bottom" title="Register">Register</Link>
      </li>
      </>
          )
        }
        
    {
          user &&<>
            
        <li class="nav-item">
            <Link to='/chat' class="nav-link" data-toggle="tooltip" data-placement="bottom" title="Conversations">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text-fill" viewBox="0 0 16 16">
  <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1"/>
</svg></Link>
            </li>
            <li class="nav-item" data-toggle="tooltip" data-placement="bottom" title="Logout">
            <Link onClick={() => logoutUser()} to='/login' class="nav-link" id='logout'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>
</Link>
        </li>
          </> 
        }
        {
      user && <>
      <li className='nav-item' style={{margin:'7px'}}>
        <Notification />
        </li>
        <li className='nav-item' style={{margin:'7px'}}>Logged in as &nbsp; <strong> { user?.name}</strong> </li></>
    }
    </ul>
    
  </div>
</nav>

        <div >
          <Outlet />
        </div>
  </>
    
  )
}

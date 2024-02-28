
import './App.css';
import {React, ReactDOM, useContext}  from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import NavBar from './components/NavBar';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import Home from './pages/Home';
import { ChatContextProvider } from './context/ChatContext';


function App() {

  const { user } = useContext(AuthContext);


  return (
    <ChatContextProvider user= {user}>
   
      <div className="App">
      <NavBar />
      {/*<h2>real time chat app</h2>*/}
        <Routes>
          <Route index element={<Home />} />
            <Route path='/login' element={user?<Home />:<Login />} />
            <Route path='/register' element={user?<Home />:<Register />} />
            <Route path='/chat' element={user?<Chat />:<Login />} />
            <Route path='*' element={<Navigate to="/" />} />
        </Routes>
    </div>
    </ChatContextProvider>
  
    
  );
}

export default App;

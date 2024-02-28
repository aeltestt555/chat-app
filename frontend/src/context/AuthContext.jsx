import { createContext, useCallback, useState, useEffect } from "react";
import { postRequest, baseUrl } from "../utils/services";


export const AuthContext = createContext();

export const AuthContextProvider =({children})=>{
    const [user, setuser] = useState(null);
    const [registerError, setregisterError] = useState(null);
    const [loginError, setloginError] = useState(null);
    const [isRegisterLoading, setisRegisterLoading] = useState(false);
    const [isLoginLoading, setisLoginLoading] = useState(false);
    const [registerInfo, setregisterInfo] = useState({
        'name': '',
        'email': '',
        'password':'',
    });
    const [loginInfo, setloginInfo] = useState({
        'email': '',
        'password':'',
    });

    

const updateRegisterInfo = useCallback( (info) =>{
    setregisterInfo(info);
}, [])

const updateLoginInfo = useCallback( (info) =>{
    setloginInfo(info);
}, [])

const registerUser= useCallback(async(e)=>{
    e.preventDefault()  //stop form submit

    setisRegisterLoading(true)
    setregisterError(null)

    const response= await postRequest(baseUrl+ '/users/register/',
     JSON.stringify(registerInfo ))

     setisRegisterLoading(false)

     if(response.error){
        return setregisterError(response)
     }
     setuser(response)
     localStorage.setItem('user', JSON.stringify(response))
     setuser(response)
    

}, [ registerInfo])

useEffect(() => {
    const loggedUser = localStorage.getItem('user' || null);
    setuser(JSON.parse(loggedUser)) 
    
}, []);

const loginUser =useCallback(async(e)=>{

    e.preventDefault();

    setisLoginLoading(true)
    setloginError(null)

    const response= await postRequest(baseUrl+ '/users/login/',
     JSON.stringify(loginInfo))

    setisLoginLoading(false)

     if(response.error) {
        return setloginError(response)
     }

     localStorage.setItem('user', JSON.stringify(response))
     setuser(response)

}, [loginInfo])



const logoutUser  =useCallback(()=>{
    localStorage.removeItem('user');
    setuser(null);
}, [])


   
    return(
        <AuthContext.Provider value={{
            user,
            registerInfo,
            updateRegisterInfo,
            registerUser,
            registerError,
            isRegisterLoading,
            logoutUser,
            updateLoginInfo,
            loginError,
            loginInfo,
            isLoginLoading,
            loginUser
            }}>
        {children}
    </AuthContext.Provider>
    )
    
}


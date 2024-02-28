
import axios from 'axios';

export const baseUrl = 'http://localhost:3001/api';


export const postRequest =  async (url, body )=>{
    const response = await fetch(url, {
        method : 'POST',
        headers: {
            "content-type": "application/json",
        },
        body,
    })
    const data = await response.json();
    if(!response.ok) {
        let message;
        if (data?.message) {
           message= data.message;
           } else {
            message= data;
           }
           return  {error: true, message}
    }
    return data;
};

export const getRequest = async(url)  => {
    const response = await fetch(url)

    const data = await response.json();
    // console.log('get request data ', data);
    if(!response.ok){
        let message = "an error occured ..."

        if(data?.message){
            message = data.message
        }
        return {error: true, message }
    }
    return data;
}
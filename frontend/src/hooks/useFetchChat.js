import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchChat= (chat, user) => {
    const [recipientUser, setrecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !==user?._id)

    useEffect(() => {
        
        const getUser = async() => {

            if(!recipientId) return null

            const response = await getRequest(baseUrl+'/users/find/'+recipientId);

            if(response.error){
                return setError(error)
            }
            setrecipientUser(response)
        }
        getUser()
    }, [recipientId]);

    return { recipientUser }

}


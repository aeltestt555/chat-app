import { useContext, useState,useEffect } from "react"
import { ChatContext } from "../context/ChatContext"
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLastMsg = (chat)=>{
    const {newMessage, notification }=useContext(ChatContext)
    const [latestMsg, setLatestMsg] = useState(null);

    useEffect(() => {
        const getmsgs = async()=>{
            const response = await getRequest(baseUrl+'/messages/'+chat?._id)
            if(response.error){
                return console.log('error getting messages', response.error);
            }
            const lastmsg = response[response?.length - 1]
            setLatestMsg(lastmsg)
        }
        getmsgs()
    }, [newMessage, notification]);
    return { latestMsg };
}


import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client"


export const ChatContext = createContext();

export const ChatContextProvider= ({children, user})=>{
    const [userChats, setUserChats]=useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading]=useState(false)
    const [userChatsError, setUserChatsError]=useState(null)
    const [potentielChat, setPotentielChat]=useState([])
    const [currentChat, setcurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [messagesError, setMessagesError] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notification, setNotification] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    
    useEffect(() => {
        if(!user) setMessages(null)
    }, [user]);

    useEffect(() => {
       const newSocket = io('https://chat-app-socketio-tbfp.onrender.com');  //TODO : remplacer par l'adresse du serve
        setSocket(newSocket);

        return () =>{
            newSocket.disconnect();
        }
    }, [user]);

    //ad online users
    useEffect(() => {
        if(socket === null) return;
        socket.emit('addNewUser', user?._id)
        socket.on('getOnlineUsers', (res)=> {
            setOnlineUsers(res)
        })
        return () => socket.off('getOnlineUsers' )
    }, [socket]);

    //send message 
    useEffect(() => {
        if(socket === null) return;
        const recipientId = currentChat?.members?.find((id) => id !==user?._id)
        socket.emit('sendMessage', {...newMessage, recipientId})
        
    }, [newMessage]);

    //receive message and notification
    useEffect(() => {
        if(socket === null) return;
        
        socket.on('getMessage', res => {
            if(currentChat?._id !== res.chatId) return;

            setMessages(prevMsgs=>[...prevMsgs, res])
        })

        socket.on('getNotification', res => {
            const isChatOpen = currentChat?.members.some(id=>id === res.senderId)
            if(isChatOpen){
                setNotification(prev => [{...res, isRead:true}, ...prev])
            }else{
                setNotification(prev => [res, ...prev])
            }
        })
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

    useEffect(() => {
        const getusers =async () =>{
            const response = await getRequest(baseUrl + "/users");
            if (response.error) {
                return console.log('error fetching users', response)
            }
            
            const pChats= response.filter((u) => {
                let isChatCreated = false;
                if(user?._id === u?._id) return false
                    
                if(userChats){
                    isChatCreated = userChats?.some((chat)=>{
                        return chat.members[0] === u?._id || chat.members[1] === u?._id
                    })
                }
                return !isChatCreated;
            })
            setPotentielChat(pChats)
            setAllUsers(response)
        }
        getusers()
    }, [userChats]);

    useEffect(() => {
        const getUserChats = async()=>{
                if(user?._id){
                    setIsUserChatsLoading(true)
                    setUserChatsError(null)

                    const response = await getRequest(baseUrl+'/chats/'+user?._id)
                    
                    setIsUserChatsLoading(false)
                    
                    if(response.error){
                        return setUserChatsError(response)
                    }
                    setUserChats(response)
                }
        }
        getUserChats()
    }, [user, notification]);

    useEffect(() => {
        const getMessages = async()=>{
                
                    setIsMessagesLoading(true)
                    setMessagesError(null)

                    const response = await getRequest(baseUrl+'/messages/'+currentChat?._id)
                    
                    setIsMessagesLoading(false)
                    
                    if(response.error){
                        return setMessagesError(response)
                    }
                    setMessages(response)
                
        }
        getMessages()
    }, [currentChat]);

    const sendtextmessage = useCallback(async(e, textMessage, sender, currentChatId, settextMessage) => {
        e.preventDefault();
        if(!textMessage) return console.log('you must type message ...')
        const response = await postRequest(baseUrl + '/messages', JSON.stringify({
            chatId : currentChatId,
            senderId : sender._id,
            text : textMessage
        }))
        if(response.error) return setSendTextMessageError(response);
        
        setNewMessage(response)
        setMessages((prev) => [...prev, response])
        settextMessage('')
    
    }, [])

    const updateCurrentChat = useCallback((chat) => {
        setcurrentChat(chat)
    }, [])

    const createChat = useCallback(async(firstId, secondId) => {
        const response = await postRequest(baseUrl+'/chats/',
         JSON.stringify({firstId, secondId}))
        if(response.error){
            return console.log('error creating  chat', response)
        }
        setUserChats((prev) => [...prev, response]);
    }, [])

    const markallnotifs = useCallback((notifs)=>{
        const mnotifications = notifs.map((n)=>{
            return {...n, isRead:true};
        }
        
            )
            setNotification(mnotifications);
    }, [])

    const markNotifAsRead= useCallback((n, userChats, user, notifications)=> {
        //find chat to open 
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId]
            const isDesiredChat =  chat?.members.every(member =>{
                return chatMembers.includes(member)
            })

            return isDesiredChat
        })

        //mark notification as read
        const mNotifs = notification.map(el =>{
            if(n.senderId === el.senderId){
                return {...n, isRead:true}
            }else{
                return el
            }
        })
        updateCurrentChat(desiredChat)
        setNotification(mNotifs)
    },[])

    const markthisnotifasread = useCallback((thisusernotif, notif) =>{
        const mnotifs = notification.map(el=>{
            let notif;

            thisusernotif.foreach(n=>{
                if(n.senderId === el.senderId){
                    notif = {...n, isRead:true}
                }else{
                    notif = el
                }
            })
            return notif
        })
        setNotification(mnotifs)
    },[])
    return (
        <>
            <ChatContext.Provider value={{ 
                user,
                userChats, 
                isUserChatsLoading,
                 userChatsError ,
                 potentielChat,
                 createChat,
                 currentChat,
                 messages,
                 updateCurrentChat,
                 isMessagesLoading,
                 messagesError,
                 sendtextmessage,
                 sendTextMessageError,
                 onlineUsers,
                 notification,
                 allUsers,
                 markallnotifs,
                 markNotifAsRead,
                 markthisnotifasread
                 }}>
                { children }
            </ChatContext.Provider>
        </>
    )
}
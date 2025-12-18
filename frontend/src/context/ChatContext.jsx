// src/context/ChatContext.js

import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentielChat, setPotentielChat] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [messagesError, setMessagesError] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notification, setNotification] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    // --- SOCKET.IO SETUP ---
    useEffect(() => {
        const newSocket = io('https://chat-app-socketio-tbfp.onrender.com'); // TODO: replace with your server address
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    // --- ONLINE USERS ---
    useEffect(() => {
        if (socket === null) return;
        socket.emit('addNewUser', user?._id);
        socket.on('getOnlineUsers', (res) => {
            setOnlineUsers(res);
        });
        return () => socket.off('getOnlineUsers');
    }, [socket]);

    // --- SEND MESSAGE ---
    useEffect(() => {
        if (socket === null) return;
        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        socket.emit('sendMessage', { ...newMessage, recipientId });
    }, [newMessage]);

    // --- RECEIVE MESSAGE & NOTIFICATION ---
    useEffect(() => {
        if (socket === null) return;

        socket.on('getMessage', res => {
            // If the message is for the currently open chat, add it to the messages list
            if (currentChat?._id === res.chatId) {
                setMessages(prev => [...prev, res]);
            }

            // --- CRITICAL: Update the userChats list to show the new latest message ---
            setUserChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === res.chatId
                        ? { ...chat, latestMsg: res } // Find the chat and update its latestMsg
                        : chat
                )
            );
        });

        socket.on('getNotification', res => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);
            if (isChatOpen) {
                setNotification(prev => [{ ...res, isRead: true }, ...prev]);
            } else {
                setNotification(prev => [res, ...prev]);
            }
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, currentChat]);

    // --- GET ALL USERS ---
    useEffect(() => {
        const getusers = async () => {
            const response = await getRequest(baseUrl + "/users");
            if (response.error) return console.log('error fetching users', response);
            
            const pChats = response.filter((u) => {
                if (user?._id === u?._id) return false;
                if (userChats) {
                    return !userChats?.some((chat) => chat.members[0] === u?._id || chat.members[1] === u?._id);
                }
                return true;
            });
            setPotentielChat(pChats);
            setAllUsers(response);
        }
        getusers();
    }, [userChats, user]);

    // --- GET USER CHATS ---
    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);
                const response = await getRequest(baseUrl + '/chats/' + user._id);
                setIsUserChatsLoading(false);
                if (response.error) return setUserChatsError(response);
                setUserChats(response);
            }
        }
        getUserChats();
    }, [user]); // Removed notification from dependency to prevent infinite loops

    // --- GET MESSAGES FOR CURRENT CHAT ---
    useEffect(() => {
        const getMessages = async () => {
            if (currentChat?._id) {
                setIsMessagesLoading(true);
                setMessagesError(null);
                const response = await getRequest(baseUrl + '/messages/' + currentChat?._id);
                setIsMessagesLoading(false);
                if (response.error) return setMessagesError(response);
                setMessages(response);
            }
        }
        getMessages();
    }, [currentChat]);

    // --- SEND TEXT MESSAGE ---
    const sendtextmessage = useCallback(async (e, textMessage, sender, currentChatId, settextMessage) => {
        e.preventDefault();
        if (!textMessage) return console.log('you must type message ...');
        const response = await postRequest(baseUrl + '/messages', JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }));
        if (response.error) return setSendTextMessageError(response);

        setNewMessage(response);
        setMessages((prev) => [...prev, response]);

        // --- CRITICAL: Update the userChats list to show the new latest message ---
        setUserChats(prevChats =>
            prevChats.map(chat =>
                chat._id === currentChatId
                    ? { ...chat, latestMsg: response } // Find the chat and update its latestMsg
                    : chat
            )
        );

        settextMessage('');
    }, []);

    // --- OTHER HELPER FUNCTIONS ---
    const updateCurrentChat = useCallback((chat) => setCurrentChat(chat), []);
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(baseUrl + '/chats/', JSON.stringify({ firstId, secondId }));
        if (response.error) return console.log('error creating chat', response);
        setUserChats((prev) => [...prev, response]);
    }, []);
    const markallnotifs = useCallback((notifs) => {
        const mnotifications = notifs.map((n) => ({ ...n, isRead: true }));
        setNotification(mnotifications);
    }, []);
    const markNotifAsRead = useCallback((n, userChats, user, notifications) => {
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId];
            return chat?.members.every(member => chatMembers.includes(member));
        });
        const mNotifs = notifications.map(el => {
            if (n.senderId === el.senderId) return { ...n, isRead: true };
            else return el;
        });
        updateCurrentChat(desiredChat);
        setNotification(mNotifs);
    }, [updateCurrentChat]);
    const markthisnotifasread = useCallback((notificationsToMark) => {
        setNotification(currentNotifications =>
            currentNotifications.map(notif => {
                const shouldBeRead = notificationsToMark.some(n => n.senderId === notif.senderId);
                if (shouldBeRead) return { ...notif, isRead: true };
                return notif;
            })
        );
    }, []);

    return (
        <ChatContext.Provider value={{
            user, userChats, isUserChatsLoading, userChatsError,
            potentielChat, createChat, currentChat, messages,
            updateCurrentChat, isMessagesLoading, messagesError,
            sendtextmessage, sendTextMessageError, onlineUsers,
            notification, allUsers, markallnotifs, markNotifAsRead,
            markthisnotifasread
        }}>
            {children}
        </ChatContext.Provider>
    )
}
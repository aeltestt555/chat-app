// src/hooks/useLatestMessage.js

import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

/**
 * A hook to find the absolute latest message for a given chat.
 * It prioritizes the live 'messages' state if the chat is currently open.
 * @param {object} chat - The chat object from the userChats list.
 * @returns {object|null} The latest message object or null if not found.
 */
export const useLatestMessage = (chat) => {
    const { currentChat, messages } = useContext(ChatContext);

    // If there's no chat object, there's no latest message.
    if (!chat) return null;

    // Scenario 1: The chat we are rendering is the one currently open.
    // The 'messages' state is the most up-to-date source for this chat.
    if (currentChat?._id === chat._id && messages && messages.length > 0) {
        return messages[messages.length - 1];
    }

    // Scenario 2: The chat is not the currently open one.
    // We must rely on the data from the 'userChats' array.
    // This is where the backend's 'latestMsg' field is crucial.
    // If it's not there, we can't find it.
    return chat.latestMsg || null;
};
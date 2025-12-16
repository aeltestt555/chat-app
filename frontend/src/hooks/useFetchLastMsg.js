import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLastMsg = (chat) => {
  const { newMessage } = useContext(ChatContext);
  const [latestMsg, setLatestMsg] = useState(chat?.latestMsg || null);

  useEffect(() => {
    if (!chat?._id) return;

    const fetchLatestMessage = async () => {
      try {
        // Only fetch messages if we have no latestMsg stored
        const response = await getRequest(`${baseUrl}/messages/${chat._id}`);
        if (!response.error) {
          const msg = response[response.length - 1];
          setLatestMsg(msg);
        }
      } catch (err) {
        console.error("Error fetching latest message:", err);
      }
    };

    // If a newMessage belongs to this chat → update last message instantly
    if (newMessage?.chatId === chat?._id) {
      setLatestMsg(newMessage);
      return;
    }

    // Startup (first render)
    fetchLatestMessage();
  }, [chat, newMessage]);

  return { latestMsg };
};

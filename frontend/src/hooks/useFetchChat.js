// src/hooks/useFetchChat.js

import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchChat = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;

            const response = await getRequest(baseUrl + '/users/find/' + recipientId);

            if (response.error) {
                return setError(response.error);
            }
            setRecipientUser(response);
        }

        if (recipientId) {
            getUser();
        }
    }, [recipientId]);

    // The hook now returns the entire recipientUser object, which includes lastSeen
    return { recipientUser, error };
};
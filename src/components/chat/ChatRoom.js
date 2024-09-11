import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, List, Typography } from '@mui/material';
import { connectToWebSocket, sendMessage } from '../../service/websocketService';
import { getChatHistory } from "../../service/chatService";
import CustomTextField from '../input/CustomTextField';
import MessageItem from "./MessageItem";

const ChatRoom = ({ currentUserId, friendId, chatRoomId }) => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const isSubscribed = useRef(false);  // Flaga, aby uniknąć wielokrotnych subskrypcji

    useEffect(() => {
        const fetchChatHistory = async () => {
            const history = await getChatHistory(chatRoomId);
            setMessages(history);
        };

        fetchChatHistory();

        // Subskrypcja WebSocket, tylko jeśli nie została jeszcze wykonana
        if (!isSubscribed.current) {
            connectToWebSocket(chatRoomId, (message) => {
                console.log("Received message: ", message.body);
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
            isSubscribed.current = true;  // Ustaw flagę po subskrypcji
        }
    }, [chatRoomId]);

    const handleSendMessage = () => {
        if (messageContent.trim()) {
            const message = {
                chatRoomId: chatRoomId,
                senderId: currentUserId,
                receiverId: friendId,
                content: messageContent
            };
            console.log("Sending message: ", message);
            sendMessage(chatRoomId, message);
            setMessageContent('');
        }
    };

    return (
        <Box>
            <List>
                {Array.isArray(messages) && messages.map((msg, index) => (
                    <MessageItem
                        key={index}
                        message={msg}
                        currentUserId={currentUserId}
                    />
                ))}
                {!Array.isArray(messages) && <Typography>Brak wiadomości</Typography>}
            </List>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <CustomTextField
                    fullWidth
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Wpisz wiadomość..."
                />
                <Button variant="contained" onClick={handleSendMessage}>Wyślij</Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;

import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, List, Typography } from '@mui/material';
import { connectToWebSocket, sendMessage } from '../../service/websocketService';
import { getChatHistory } from "../../service/chatService";
import CustomTextField from '../input/CustomTextField';
import MessageItem from "./MessageItem";

const ChatRoom = ({ currentUserId, friendId, chatRoomId }) => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const isSubscribed = useRef(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchChatHistory = async () => {
            const history = await getChatHistory(chatRoomId);
            setMessages(history);
        };
        fetchChatHistory();

        if (!isSubscribed.current) {
            connectToWebSocket(chatRoomId, (message) => {
                console.log("Received message: ", message.body);
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
            isSubscribed.current = true;
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100%' }}>
            <Box sx={{ flexGrow: 1, maxHeight: '80%', overflowY: 'auto' }}>
                <List>
                    {Array.isArray(messages) && messages.map((msg, index) => (
                        <MessageItem
                            key={index}
                            message={msg}
                            currentUserId={currentUserId}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                    {!Array.isArray(messages) && <Typography>Brak wiadomości</Typography>}
                </List>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, padding: 2, position: 'sticky', bottom: 0}}>
                <CustomTextField
                    fullWidth
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress = {handleKeyPress}
                    placeholder="Wpisz wiadomość..."
                />
                <Button variant="contained" onClick={handleSendMessage}>Wyślij</Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;

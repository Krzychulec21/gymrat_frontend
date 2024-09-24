import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, List, Typography } from '@mui/material';
import { connectToChatRoom, sendMessage, getChatHistory } from '../../service/chatService';
import CustomTextField from '../input/CustomTextField';
import MessageItem from "./MessageItem";
import websocketService from '../../service/websocketService';
import {useAuth} from "../../context/AuthContext";

const ChatRoom = ({ currentUserId, friendId, chatRoomId }) => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const messagesEndRef = useRef(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchChatHistory = async () => {
            const history = await getChatHistory(chatRoomId);
            setMessages(history);
        };

        const handleNewMessage = (message) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, message];
                return updatedMessages;
            });
        };

        if (!websocketService.connected) {
            websocketService.connect();
        }

        fetchChatHistory();
        connectToChatRoom(chatRoomId, handleNewMessage);

        return () => {
            websocketService.unsubscribe(`/user/queue/chat/${chatRoomId}`);
        };
    }, [isAuthenticated, chatRoomId]);


    const handleSendMessage = () => {
        if (messageContent.trim()) {
            const message = {
                chatRoomId: chatRoomId,
                senderId: currentUserId,
                receiverId: friendId,
                content: messageContent
            };
            sendMessage(chatRoomId, message);
            setMessageContent('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

            <Box sx={{ display: 'flex', gap: 2, padding: 2, position: 'sticky', bottom: 0 }}>
                <CustomTextField
                    fullWidth
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Wpisz wiadomość..."
                />
                <Button variant="contained" onClick={handleSendMessage}>Wyślij</Button>
            </Box>
        </Box>
    );
};

export default ChatRoom;
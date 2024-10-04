import React, {useEffect, useRef, useState} from 'react';
import {Box, List, Typography} from '@mui/material';
import {connectToChatRoom, getChatHistory, sendMessage} from '../../service/chatService';
import CustomTextField from '../input/CustomTextField';
import MessageItem from './MessageItem';
import websocketService from '../../service/websocketService';
import {useAuth} from '../../context/AuthContext';
import CustomButton from "../button/CustomButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const ChatRoom = ({currentUserId, friendId, chatRoomId, friendName}) => {
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState('');
    const messagesEndRef = useRef(null);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchChatHistory = async () => {
            const history = await getChatHistory(chatRoomId);
            setMessages(history);
        };

        const handleNewMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
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
                content: messageContent,
            };
            sendMessage(chatRoomId, message);
            setMessageContent('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '90vh'}}>
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: '#3f3f3f',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Typography variant="h6" sx={{textAlign: 'center'}}>{friendName}</Typography>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                }}
            >
                <List>
                    {Array.isArray(messages) && messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <MessageItem key={index} message={msg} currentUserId={currentUserId}/>
                        ))
                    ) : (
                        <Typography sx={{textAlign: 'center'}}>No messages yet</Typography>
                    )}
                    <div ref={messagesEndRef}/>
                </List>
            </Box>

            {/* Message Input */}
            <Box
                sx={{
                    padding: 2,
                    borderTop: '1px solid #ccc',
                }}
            >
                <Box sx={{display: 'flex', gap: 2}}>
                    <TextField
                        fullWidth
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <Button variant="contained" onClick={handleSendMessage}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatRoom;

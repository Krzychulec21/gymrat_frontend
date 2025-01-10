import React, {useEffect, useRef, useState} from 'react';
import {Box, List, Typography} from '@mui/material';
import {connectToChatRoom, getChatHistory, sendMessage} from '../../service/chatService';
import MessageItem from './MessageItem';
import websocketService from '../../service/websocketService';
import {useAuth} from '../../context/AuthContext';
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
        <Box sx={{display: 'flex', flexDirection: 'column', height: '85vh'}}>
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: '#3f3f3f',
                    borderBottom: '1px solid #ccc',
                    borderRadius: '8px'
                }}
            >
                <Typography variant="h6" sx={{textAlign: 'center'}}>{friendName}</Typography>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                    height: "100%", '&::-webkit-scrollbar': {
                        width: '8px'
                    },

                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)', outline: '1px solid white', borderRadius: '10px'
                    }
                }}
            >
                <List>
                    {Array.isArray(messages) && messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <MessageItem key={index} message={msg} currentUserId={currentUserId}/>
                        ))
                    ) : (
                        <Typography sx={{textAlign: 'center'}}>Brak wiadomości</Typography>
                    )}
                    <div ref={messagesEndRef}/>
                </List>
            </Box>

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
                        placeholder="Wprowadź wiadomość..."
                    />
                    <Button variant="contained" onClick={handleSendMessage}>
                        Wyślij
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatRoom;

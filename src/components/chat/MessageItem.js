import React from 'react';
import {Box, ListItem, ListItemText} from '@mui/material';

const MessageItem = ({message, currentUserId}) => {
    const isCurrentUser = String(message.senderId) === String(currentUserId);
    return (
        <ListItem
            sx={{
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                display: 'flex',
            }}
        >
            <Box
                sx={{
                    backgroundColor: isCurrentUser ? '#b62828' : 'rgba(84,37,37,0.94)',
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '60%',
                    textAlign: isCurrentUser ? 'right' : 'left',
                    wordBreak: 'break-word',
                }}
            >
                <ListItemText primary={message.content}/>
            </Box>
        </ListItem>
    );
};

export default MessageItem;

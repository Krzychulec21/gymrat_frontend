import React from 'react';
import { ListItem, ListItemText, Box } from '@mui/material';

const MessageItem = ({ message, currentUserId }) => {
    const isCurrentUser = String(message.senderId) === String(currentUserId); // Sprawdź, czy to wiadomość aktualnie zalogowanego użytkownika
    return (
        <ListItem
            sx={{
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', // Wyrównanie wiadomości
                display: 'flex'
            }}
        >
            <Box
                sx={{
                    backgroundColor: isCurrentUser ? '#333232' : '#483434', // Kolor tła dla wiadomości
                    padding: '10px',
                    borderRadius: '10px',
                    maxWidth: '60%',
                    textAlign: isCurrentUser ? 'right' : 'left' // Tekst wiadomości wyrównany odpowiednio
                }}
            >
                <ListItemText
                    primary={message.content}
                />
            </Box>
        </ListItem>
    );
};

export default MessageItem;

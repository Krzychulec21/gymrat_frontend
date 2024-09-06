import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Button } from '@mui/material';
import { sendFriendRequest } from '../../service/friendService';
import axiosInstance from "../../utils/axiosInstance";
import CustomTextField from '../Input/CustomTextField';

const SendFriendRequestForm = () => {
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const fetchUsersWithStatus = async () => {
        try {
            const response = await axiosInstance.get('/friends/users-with-request-status');
            setUsers(response.data); // Now this includes the request status as well
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        }
    };

    useEffect(() => {
        fetchUsersWithStatus();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        const filtered = users.filter(user =>
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSendRequest = async (selectedEmail) => {
        try {
            await sendFriendRequest(selectedEmail);
            console.log(`Zaproszenie wysłane do: ${selectedEmail}`);
            fetchUsersWithStatus();  // Reload the user list after sending a request
        } catch (error) {
            console.error('Błąd podczas wysyłania zaproszenia:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '50%', margin: "auto" }}>
            <CustomTextField
                label="Wpisz email znajomego"
                variant="outlined"
                value={email}
                onChange={handleInputChange}
                fullWidth
            />
            {filteredUsers.length > 0 && (
                <List sx={{ backgroundColor: 'black', borderRadius: 1, padding: 2 }}>
                    {filteredUsers.map(user => (
                        <ListItem
                            key={user.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid red',
                                padding: '10px',
                                '&:last-child': { borderBottom: 'none' }
                            }}
                        >
                            <ListItemText primary={user.email} sx={{ color: 'white' }} />
                            {user.isRequestSent ? (
                                <Button disabled sx={{ color: 'gray' }}>Wysłano</Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSendRequest(user.email)}
                                >
                                    Wyślij zaproszenie
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default SendFriendRequestForm;

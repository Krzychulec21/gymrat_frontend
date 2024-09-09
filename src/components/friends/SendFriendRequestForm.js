import React, { useState, useEffect } from 'react';
import { Box,  ListItemText, Alert, Snackbar } from '@mui/material';
import { sendFriendRequest } from '../../service/friendService';
import axiosInstance from "../../utils/axiosInstance";
import CustomTextField from '../input/CustomTextField';
import CustomListWithSearch from "../list/CustomListWithSearch";
import CustomButton from "../button/CustomButton";

const SendFriendRequestForm = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);


    const fetchUsersWithStatus = async () => {
        try {
            const response = await axiosInstance.get('/friends/users-with-request-status');
            setUsers(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        }
    };

    useEffect(() => {
        fetchUsersWithStatus();
    }, []);


    const handleSendRequest = async (selectedEmail) => {
        try {
            await sendFriendRequest(selectedEmail);
            console.log(`Zaproszenie wysłane do: ${selectedEmail}`);
            setErrorMessage('');
            setOpenSnackbar(true);
        } catch (error) {
            if (error.response.status === 409) {
                setErrorMessage("Zaproszenie zostało już wysłane lub zaakceptowane");
            }
            else {
                setErrorMessage("Wystąpił błąd podczas wysyłania zaproszania");
            }
            setOpenSnackbar(true);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '50%', margin: "auto" }}>
            <CustomListWithSearch data={users} label="wybierz uzytkownika" onItemSelect={handleUserSelect} filterKey="email" renderItem={(user) => <ListItemText primary={user.email} /> } />
            {selectedUser && (
                <CustomButton onClick={() => handleSendRequest(selectedUser.email)}>Dodaj znajomego</CustomButton>
            )}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{vertical: 'top',
                horizontal: 'center'}}>
                <Alert onClose={handleCloseSnackbar} severity={errorMessage ? "error" : "success"}>
                    {errorMessage || "Zaproszenie zostało pomyślnie wysłane!"}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SendFriendRequestForm;

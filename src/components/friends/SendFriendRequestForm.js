import React, {useState} from 'react';
import {Box, List, Pagination} from '@mui/material';
import {searchUsersWithRequestStatus, sendFriendRequest} from '../../service/friendService';
import Button from "@mui/material/Button";
import UserListItem from "./UserListItem";
import TextField from "@mui/material/TextField";
import {useSnackbar} from "../../context/SnackbarContext";

const SendFriendRequestForm = () => {
    const {showSnackbar} = useSnackbar();
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleSearch = async (page = 0) => {
        if (query.length > 0) {
            try {
                const data = await searchUsersWithRequestStatus(query, page, 10);
                setUsers(data.content);
                setCurrentPage(page);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSendRequest = async (selectedEmail) => {
        try {
            await sendFriendRequest(selectedEmail);
            showSnackbar("Pomyślnie wysłano zaproszenie", 'success');
            setOpenSnackbar(true);
        } catch (error) {
            if (error.response.status === 409) {
                showSnackbar("Zaproszenie zostało już wysłane", 'error');
            } else {
                showSnackbar("Wystąpił błąd podczas wysyłania zaproszania", 'error');
            }
            setOpenSnackbar(true);
        }
    };

    const handlePageChange = (event, value) => {
        handleSearch(value - 1);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (<Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        mt: '20px',
        mb: '20px',
        height: '80vh'
    }}>
        <Box sx={{display: 'flex', gap: 1}}>
            <TextField
                size="small"
                label="Wpisz frazę"
                value={query}
                onKeyPress={handleKeyPress}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button size="small" variant="contained" onClick={() => handleSearch(0)}>
                Szukaj
            </Button>
        </Box>
        <Box
            sx={{
                overflowY: "auto", height: "100%",
            }}
        >
            <List>
                {users.map((user) => (<UserListItem
                    key={user.id}
                    user={user}
                    primaryActionIcon={user.friendRequestSent ? (
                        <Button size="small" disabled>Zaproszenie wysłane</Button>) : (
                        <Button size="small">Dodaj znajomego</Button>)}
                    onPrimaryAction={() => handleSendRequest(user.email)}
                />))}
            </List>
        </Box>
        {totalPages > 1 && (<Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
        />)}
    </Box>);
};

export default SendFriendRequestForm;

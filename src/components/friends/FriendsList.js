import React, {useState} from 'react';
import {
    List,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, Box, Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import UserListItem from "./UserListItem";
import CustomButton from "../button/CustomButton";
import {useMediaQuery, useTheme} from "@mui/system";


const FriendsList = ({friends, onRemoveFriend, onChatStart}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const theme = useTheme();

    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const itemsPerPage = isMdUp ? 15 : 6;

    const handleDeleteClick = (friend) => {
        setSelectedFriend(friend);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFriend(null);
    };

    const handleConfirmDelete = () => {
        if (selectedFriend) {
            onRemoveFriend(selectedFriend.email);
        }
        handleCloseDialog();
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFriends = friends.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'80vh' }}>
                <Box sx={{overflowY: 'auto'}}>
                <List>
                    {currentFriends.map((friend) => (
                        <UserListItem
                            key={friend.id}
                            user={friend}
                            primaryActionIcon={<CustomButton>Chat</CustomButton>}
                            secondaryActionIcon={<DeleteIcon sx={{color: 'red'}}/>}
                            onPrimaryAction={() => onChatStart(friend.id, friend.firstName, friend.lastName)}
                            onSecondaryAction={() => handleDeleteClick(friend)}
                        />
                    ))}
                </List>
            </Box>

                <Pagination
                    count={Math.ceil(friends.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        "& .MuiPaginationItem-root": {
                            color: 'white', // Text color
                        },
                        "& .Mui-selected": {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Active background color with some transparency
                            color: 'black' // Text color for selected item
                        },
                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: 'rgba(255, 255, 255, 0.4)', // Hover background color
                        }
                    }}
                />
            </Box>


            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć{' '}
                        {selectedFriend ? `${selectedFriend.firstName} ${selectedFriend.lastName}` : ''} z listy
                        znajomych?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FriendsList;

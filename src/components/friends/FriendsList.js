import React, {useState} from 'react';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import UserListItem from "./UserListItem";


const FriendsList = ({friends, onRemoveFriend, onChatStart, currentPage, setCurrentPage, totalPages}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);


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
        setCurrentPage(value - 1);
    };


    return (
        <>

            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '80vh'}}>
                <Box
                    sx={{
                        overflowY: "auto",
                        height: "100%",
                        '&::-webkit-scrollbar': {
                            width: '8px'
                        },

                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,.1)',
                            outline: '1px solid white',
                            borderRadius: '10px'
                        }
                    }}
                >
                    <List>
                        {friends.map((friend) => (
                            <UserListItem
                                key={friend.id}
                                user={friend}
                                primaryActionIcon={<Button size="small">Chat</Button>}
                                secondaryActionIcon={<DeleteIcon sx={{color: 'red'}}/>}
                                onPrimaryAction={() => onChatStart(friend.id, friend.firstName, friend.lastName)}
                                onSecondaryAction={() => handleDeleteClick(friend)}
                            />
                        ))}
                    </List>
                </Box>

                <Pagination
                    count={totalPages}
                    page={currentPage + 1}
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

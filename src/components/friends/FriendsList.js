// FriendsList.js

import React, {useState} from 'react';
import {
    List,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import UserListItem from "./UserListItem";
import CustomButton from "../button/CustomButton";

const FriendsList = ({friends, onRemoveFriend, onChatStart}) => {
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

    return (
        <>
            <List>
                {friends.map((friend) => (
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

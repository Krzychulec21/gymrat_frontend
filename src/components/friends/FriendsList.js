import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from "../button/CustomButton";
import ChatIcon from '@mui/icons-material/Chat';
import Button from "@mui/material/Button";

const FriendsList = ({ friends, onRemoveFriend, onChatStart }) => {
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
                    <ListItem key={friend.id} sx={{ display: 'flex', alignItems: 'center',  }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <Avatar alt={`${friend.firstName} ${friend.lastName}`} src={friend.avatarUrl} />
                            <ListItemText
                                primary={`${friend.firstName} ${friend.lastName}`}
                                secondary={friend.email}
                                sx={{
                                    "& .MuiListItemText-secondary": { color: "white" },
                                    ml: 2
                                }}
                            />
                            <CustomButton
                                startIcon={<ChatIcon />}
                                onClick={() => onChatStart(friend.id)}
                                sx={{ ml: 2 }}
                            >
                                Czat
                            </CustomButton>
                        </Box>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(friend)}>
                            <DeleteIcon sx={{ color: 'red' }} />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć {selectedFriend ? `${selectedFriend.firstName} ${selectedFriend.lastName}` : ''} z listy znajomych?
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

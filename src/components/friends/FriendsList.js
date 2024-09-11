import React from 'react';
import { List, ListItem, ListItemText, Avatar, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomButton from "../button/CustomButton";
import ChatIcon from '@mui/icons-material/Chat';

const FriendsList = ({ friends, onRemoveFriend, onChatStart }) => {
    return (
        <List>
            {friends.map((friend) => (
                <ListItem key={friend.id}>
                    <Avatar alt={"essa"} src={friend.avatarUrl} />
                    <ListItemText primary={friend.firstName + friend.lastName}  secondary={friend.email}  sx={{
                        "& .MuiListItemText-secondary": {
                            color: "white"
                        }}}/>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFriend(friend.email)}>
                            <DeleteIcon />
                        </IconButton>
                        <CustomButton
                            startIcon={<ChatIcon/>}
                            onClick={() => onChatStart(friend.id)}
                            >Czat</CustomButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default FriendsList;

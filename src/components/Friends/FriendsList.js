import React from 'react';
import { List, ListItem, ListItemText, Avatar, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FriendsList = ({ friends, onRemoveFriend }) => {
    return (
        <List>
            {friends.map((friend) => (
                <ListItem key={friend.id}>
                    <Avatar alt={"essa"} src={friend.avatarUrl} />
                    <ListItemText primary={friend.name} secondary={friend.email} />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFriend(friend.email)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default FriendsList;

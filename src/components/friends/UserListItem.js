import React from 'react';
import {ListItem, ListItemAvatar, ListItemText, Avatar, Box, IconButton, Link} from '@mui/material';
import {useNavigate} from "react-router-dom";

const UserListItem = ({
                          user,
                          primaryActionIcon,
                          secondaryActionIcon,
                          onPrimaryAction,
                          onSecondaryAction,
                      }) => {

    const handleUserClick = (userId) => navigate(`/profile/${userId}`);
    
    const navigate = useNavigate();
    return (
        <ListItem sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
            <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                <ListItemAvatar>
                    <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.avatar}/>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Link
                            component="button"
                            onClick={() => handleUserClick(user.userId)}
                            underline="hover"
                            color="white"
                        >
                            {`${user.firstName} ${user.lastName} (${user.email})`}
                        </Link>
                    }
                    secondary={`${
                        user.latestMessageTimestamp
                            ? new Date(user.latestMessageTimestamp).toLocaleString('pl-PL', {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })
                            : ''
                    }`}
                    sx={{ ml: 2 }}
                />

            </Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                {primaryActionIcon && (
                    <IconButton onClick={() => onPrimaryAction(user)}>
                        {primaryActionIcon}
                    </IconButton>
                )}
                {secondaryActionIcon && (
                    <IconButton onClick={() => onSecondaryAction(user)}>
                        {secondaryActionIcon}
                    </IconButton>
                )}
            </Box>
        </ListItem>
    );
};

export default UserListItem;

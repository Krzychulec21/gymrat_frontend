import React from 'react';
import {ListItem, ListItemAvatar, ListItemText, Avatar, Box, IconButton} from '@mui/material';

const UserListItem = ({
                          user,
                          primaryActionIcon,
                          secondaryActionIcon,
                          onPrimaryAction,
                          onSecondaryAction,
                      }) => {
    return (
        <ListItem sx={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
            <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
                <ListItemAvatar>
                    <Avatar alt={`${user.firstName} ${user.lastName}`} src={user.avatarUrl}/>
                </ListItemAvatar>
                <ListItemText
                    primary={`${user.firstName} ${user.lastName} (${user.email})`}
                    secondary={`${user.latestMessageTimestamp ? new Date(user.latestMessageTimestamp).toLocaleString() : ''}`}
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

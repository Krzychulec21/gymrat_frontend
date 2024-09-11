import React from 'react';
import {Avatar, Box, IconButton, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PendingRequestsList = ({ requests, onAccept, onReject }) => {
    return (
        <List>
            <h1>eloszka</h1>
            {requests.map((request) => (
                <ListItem key={request.id}
                          sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/* Lewa część - avatar i dane użytkownika */}
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <ListItemAvatar>
                            <Avatar alt={request.senderEmail} src={request.senderAvatar}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${request.senderFirstName} (${request.senderLastName})`}
                            secondary={request.senderEmail}
                            sx={{marginLeft: 2}}
                        />
                    </Box>

                    {/* Prawa część - przyciski akcji */}
                    <Box>
                        <IconButton color="success" onClick={() => onAccept(request.Id)}>
                            <CheckCircleIcon/>
                        </IconButton>
                        <IconButton color="error" onClick={() => onReject(request.Id)}>
                            <CancelIcon/>
                        </IconButton>
                    </Box>
                </ListItem>
            ))}
        </List>
    );
};

export default PendingRequestsList;

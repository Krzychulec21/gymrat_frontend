// PendingRequestsList.js

import React from 'react';
import {List} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import UserListItem from "./UserListItem";

const PendingRequestsList = ({requests, onAccept, onReject}) => {
    return (
        <List>
            {requests.map((request) => (
                <UserListItem
                    key={request.id}
                    user={{
                        firstName: request.senderFirstName,
                        lastName: request.senderLastName,
                        email: request.senderEmail,
                        avatarUrl: request.senderAvatar,
                    }}
                    primaryActionIcon={<CheckCircleIcon color="success"/>}
                    secondaryActionIcon={<CancelIcon color="error"/>}
                    onPrimaryAction={() => onAccept(request.Id)}
                    onSecondaryAction={() => onReject(request.Id)}
                />
            ))}
        </List>
    );
};

export default PendingRequestsList;

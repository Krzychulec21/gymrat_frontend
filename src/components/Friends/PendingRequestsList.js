import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

const PendingRequestsList = ({ requests, onAccept, onReject }) => {
    return (
        <>
            {requests.map((request) => (
                <Card key={request.id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">Zaproszenie od {request.senderName}</Typography>
                        <Typography color="textSecondary">{request.senderEmail}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => onAccept(request.id)}>Akceptuj</Button>
                        <Button size="small" color="secondary" onClick={() => onReject(request.id)}>Odrzuć</Button>
                    </CardActions>
                </Card>
            ))}
        </>
    );
};

export default PendingRequestsList;

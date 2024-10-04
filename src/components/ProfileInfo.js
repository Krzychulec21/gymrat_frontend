import React from 'react';
import {Avatar, Box, Typography} from "@mui/material";

const ProfileInfo = ({user}) => {

    return (
        <Box sx={{display:'flex', flexDirection:'column', border: '2px solid red', alignItems:'center', maxWidth: {xs:'90%', md: '60%'}}}>
            <Avatar
                sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h3" gutterBottom>
                {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" gutterBottom>
                ({user.email})
            </Typography>
        </Box>
    );
};

export default ProfileInfo;
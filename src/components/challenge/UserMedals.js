import React, {useEffect, useState} from 'react';
import {Box, Card, CardContent, Typography} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {getUserMedals} from "../../service/challengeService";

function MedalCard({color, count}) {
    return (
        <Card sx={{width: 100, height: 100, textAlign: 'center', mx: 1}}>
            <CardContent>
                <EmojiEventsIcon sx={{fontSize: 40, color}}/>
                <Typography variant="h5">{count}</Typography>
            </CardContent>
        </Card>
    );
}

export default function UserMedals() {
    const [medals, setMedals] = useState({goldMedals: 0, silverMedals: 0, bronzeMedals: 0});
    useEffect(() => {
        getUserMedals().then(setMedals);
    }, []);

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
            <MedalCard color="gold" count={medals.goldMedals}/>
            <MedalCard color="silver" count={medals.silverMedals}/>
            <MedalCard color="#cd7f32" count={medals.bronzeMedals}/>
        </Box>
    );
}

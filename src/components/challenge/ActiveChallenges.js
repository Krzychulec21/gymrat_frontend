import React, {useEffect, useState} from 'react';
import {getUserActiveChallenges} from '../../service/challengeService';
import {Card, CardContent, Grid, Typography} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import {useNavigate} from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';

export default function ActiveChallenges() {
    const [challenges, setChallenges] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getUserActiveChallenges(page, rowsPerPage).then((data) => {
            setChallenges(data.content || []);
            setTotal(data.totalElements);
        });
    }, [page, rowsPerPage]);

    const handleClick = (id) => {
        navigate(`/challenges/${id}/details`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <>
            <Grid container spacing={2} sx={{my: 2}}>
                {challenges.map((ch, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card onClick={() => handleClick(ch.id)} sx={{cursor: 'pointer'}}>
                            <CardContent>
                                <Typography variant="h6">{ch.challengeName}</Typography>
                                <Typography>Dni do końca: {ch.daysLeft}</Typography>
                                <Typography>Uczestnicy: {ch.participantCount}</Typography>
                                {ch.isPublic ? <PublicIcon/> : <LockIcon/>}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[4]}
                rowsPerPage={rowsPerPage}
            />
        </>
    );
}

import React, {useEffect, useState} from 'react';
import {getAvailableChallenges} from '../../service/challengeService';
import {Box, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import {useNavigate} from 'react-router-dom';

export default function AvailableChallengesTable() {
    const [challenges, setChallenges] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const loadData = () => {
        getAvailableChallenges(page, rowsPerPage).then((data) => {
            setChallenges(data.content || []);
            setTotal(data.totalElements);
        })
    }

    useEffect(() => {
        loadData();
    }, [page, rowsPerPage]);

    const handleRowClick = (id) => {
        navigate(`/challenges/${id}/details`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <Box sx={{
            padding: '20px',
            backgroundColor: '#2C2C2C',
            borderRadius: '8px',
            color: 'white',
            width: '90%',
            margin: 'auto'
        }}>
            <Typography variant="h6" gutterBottom>Dostępne Wyzwania</Typography>
            <Box sx={{overflowX: 'auto'}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Autor</TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Ćwiczenie</TableCell>
                            <TableCell>Dni do końca</TableCell>
                            <TableCell>Uczestnicy</TableCell>
                            <TableCell>Publiczne?</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {challenges.map((ch, index) => (
                            <TableRow key={index} hover sx={{cursor: 'pointer'}} onClick={() => handleRowClick(ch.id)}>
                                <TableCell>{ch.authorNickname}</TableCell>
                                <TableCell>{ch.challengeTypeName}</TableCell>
                                <TableCell>{ch.exerciseName || 'Brak'}</TableCell>
                                <TableCell>{ch.daysLeft}</TableCell>
                                <TableCell>{ch.participantCount}</TableCell>
                                <TableCell>{ch.isPublic ? <PublicIcon/> : <LockIcon/>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />
        </Box>
    )
}

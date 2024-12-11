import React, {useEffect, useState} from 'react';
import {getUserHistoryChallenges} from '../../service/challengeService';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Card,
    CardContent,
    Typography,
    TablePagination,
    Box
} from '@mui/material';
import {useNavigate} from 'react-router-dom';

export default function ChallengeHistoryTable() {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getUserHistoryChallenges(page, rowsPerPage).then(data=>{
            setHistory(data.content||[]);
            setTotal(data.totalElements);
        })
    }, [page, rowsPerPage]);

    const handleRowClick = (id) => {
        navigate(`/challenges/${id}/details`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    return (
        <Box sx={{ padding: '20px', backgroundColor: '#2C2C2C', borderRadius: '8px', color: 'white', width: '90%', margin: 'auto', mt:5}}>
                <Typography variant="h6" gutterBottom>Historia Wyzwań</Typography>
                <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Data Startu</TableCell>
                            <TableCell>Data Zakończenia</TableCell>
                            <TableCell>Ćwiczenie</TableCell>
                            <TableCell>Ukończone?</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((ch, index) => (
                            <TableRow key={index} hover sx={{cursor:'pointer'}} onClick={()=>handleRowClick(ch.id)}>
                                <TableCell>{ch.name}</TableCell>
                                <TableCell>{ch.typeName}</TableCell>
                                <TableCell>{ch.statusName}</TableCell>
                                <TableCell>{ch.startDate}</TableCell>
                                <TableCell>{ch.endDate}</TableCell>
                                <TableCell>{ch.exerciseName||'Brak'}</TableCell>
                                <TableCell>{ch.userHasScore?'Tak':'Nie'}</TableCell>
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

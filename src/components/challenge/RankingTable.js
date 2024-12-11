import React, {useEffect, useState} from 'react';
import {Box, Link, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography} from '@mui/material';
import {EmojiEvents} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {getAllRanking, getFriendsRanking} from '../../service/challengeService';

export default function RankingTable({title, isGlobal = true}) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = isGlobal ? getAllRanking : getFriendsRanking;

        fetchData(page, rowsPerPage).then(res => {
            setData(res.content);
            setTotalElements(res.totalElements);
        });
    }, [isGlobal, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => setPage(newPage);


    const handleUserClick = (userId) => navigate(`/profile/${userId}`);

    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1:
                return <EmojiEvents sx={{color: 'gold', ml: 1}}/>;
            case 2:
                return <EmojiEvents sx={{color: 'silver', ml: 1}}/>;
            case 3:
                return <EmojiEvents sx={{color: '#cd7f32', ml: 1}}/>;
            default:
                return null;
        }
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
            <Typography variant="h5" gutterBottom sx={{textAlign: 'center'}}>{title}</Typography>
            <Box sx={{overflowX: 'auto'}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Pozycja</TableCell>
                            <TableCell>Nickname</TableCell>
                            <TableCell>Gold</TableCell>
                            <TableCell>Silver</TableCell>
                            <TableCell>Bronze</TableCell>
                            <TableCell>Punkty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((user, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{user.rankPosition}</TableCell>
                                <TableCell>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <Link component="button" onClick={() => handleUserClick(user.userId)}>
                                            {user.nickname}
                                        </Link>
                                        {getMedalIcon(user.rankPosition)}
                                    </Box>
                                </TableCell>
                                <TableCell>{user.goldMedals}</TableCell>
                                <TableCell>{user.silverMedals}</TableCell>
                                <TableCell>{user.bronzeMedals}</TableCell>
                                <TableCell>{user.totalPoints}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />
        </Box>
    );
}

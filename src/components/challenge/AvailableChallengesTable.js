import React, {useEffect, useState} from 'react';
import {getAvailableChallenges, joinChallenge} from '../../service/challengeService';
import {
    Box,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import {useNavigate} from 'react-router-dom';
import Button from "@mui/material/Button";
import {useSnackbar} from "../../context/SnackbarContext";

export default function AvailableChallengesTable({refreshChallenges}) {
    const [challenges, setChallenges] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState("name");
    const [sortDir, setSortDir] = useState("asc");
    const [publicFilter, setPublicFilter] = useState(null);
    const [typeFilter, setTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const {showSnackbar} = useSnackbar();


    const loadData = () => {
        getAvailableChallenges(page, rowsPerPage, sortBy, sortDir, publicFilter, typeFilter, categoryFilter).then((data) => {
            console.log("Odpowiedź z backendu:", data);
            setChallenges(data.content || []);
            setTotal(data.totalElements);
        });
    };

    useEffect(() => {
        loadData();
    }, [page, rowsPerPage, sortBy, sortDir, publicFilter, typeFilter, categoryFilter]);

    const handleRowClick = (id) => {
        navigate(`/challenges/${id}/details`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSort = (property) => {
        let backendProperty = property;
        if (property === "daysLeft") {
            backendProperty = "endDate";
        } else if (property === "participantCount") {
            backendProperty = "challengeParticipants.size";
        }
        const isAsc = sortBy === backendProperty && sortDir === "asc";
        setSortDir(isAsc ? "desc" : "asc");
        setSortBy(backendProperty);
    };

    const handleJoinChallenge = async (id) => {
        try {
            await joinChallenge(id);
            showSnackbar("Pomyślnie dołączono do wyzwania");
            loadData();
            refreshChallenges();
        } catch (error) {
            showSnackbar("Wystąpił błąd podczas dołączania", "error")
        }
    }


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

            <Box sx={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
                <Select value={publicFilter} onChange={(e) => setPublicFilter(e.target.value)} displayEmpty>
                    <MenuItem value={null}>Wszystkie</MenuItem>
                    <MenuItem value={true}>Publiczne</MenuItem>
                    <MenuItem value={false}>Prywatne</MenuItem>
                </Select>
            </Box>

            <Box sx={{overflowX: 'auto'}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel active={sortBy === "authorNickname"} direction={sortDir}
                                                onClick={() => handleSort("authorNickname")}>Autor</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortBy === "challengeTypeName"} direction={sortDir}
                                                onClick={() => handleSort("challengeTypeName")}>Typ</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortBy === "exerciseName"} direction={sortDir}
                                                onClick={() => handleSort("exerciseName")}>Ćwiczenie</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortBy === "daysLeft"} direction={sortDir}
                                                onClick={() => handleSort("daysLeft")}>Dni do końca</TableSortLabel>
                            </TableCell>
                            <TableCell>
                                Uczestnicy
                            </TableCell>
                            <TableCell>Widoczność</TableCell>
                            <TableCell>Akcja</TableCell>
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
                                <TableCell>
                                    <Button onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoinChallenge(ch.id);

                                    }}
                                    >
                                        Dołącz
                                    </Button>
                                </TableCell>
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

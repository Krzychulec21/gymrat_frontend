import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteChallenge, getChallengeDetails} from "../service/challengeService";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ChallengeDetailsPage() {
    const {id} = useParams();
    const [challenge, setChallenge] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [isAuthor, setIsAuthor] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [openConfirm, setOpenConfirm] = useState(false);

    const navigate = useNavigate();

    const loadDetails = async () => {
        try {
            const data = await getChallengeDetails(id);
            setChallenge(data.challenge);
            setParticipants(data.participants || []);
            setIsAuthor(data.isAuthor);
            setTotal(data.participants?.length || 0);
        } catch (error) {
            console.error("Error loading challenge details:", error);
        }
    };

    useEffect(() => {
        loadDetails();
    }, [id]);

    if (!challenge) return <div>Loading...</div>;

    const daysLeft = Math.max(
        0,
        challenge.endDate
            ? (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
            : 0
    );

    const handleDelete = async () => {
        try {
            await deleteChallenge(id);
            navigate("/challenges");
        } catch (error) {
            console.error("Error deleting challenge:", error);
        }
    };

    return (
        <Box sx={{p: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card sx={{p: 2}}>
                        <Typography variant="h5">{challenge.name}</Typography>
                        <Typography variant="body1">Autor: {challenge.authorNickname}</Typography>
                        <Typography variant="body1">Typ wyzwania: {challenge.typeName}</Typography>
                        <Typography variant="body1">Data startu: {challenge.startDate}</Typography>
                        <Typography variant="body1">Data końca: {challenge.endDate}</Typography>
                        <Typography variant="body1">Dni do końca: {Math.floor(daysLeft)}</Typography>
                        <Typography variant="body1">
                            Ćwiczenie: {challenge.exerciseName || "Brak"}
                        </Typography>
                        <Typography variant="body1">
                            Liczba uczestników: {challenge.numberOfParticipants}
                        </Typography>
                        <Typography variant="body1">
                            {challenge.isPublic ? "Publiczne" : "Prywatne"}
                        </Typography>

                        {isAuthor && (
                            <>
                                <IconButton onClick={() => setOpenConfirm(true)}>
                                    <DeleteIcon/>
                                </IconButton>
                                <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                                    <DialogTitle>Czy na pewno chcesz usunąć to wyzwanie?</DialogTitle>
                                    <DialogActions>
                                        <Button onClick={() => setOpenConfirm(false)}>Anuluj</Button>
                                        <Button onClick={handleDelete} color="error">
                                            Usuń
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </>
                        )}
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Aktualny ranking uczestników
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Użytkownik</TableCell>
                                        <TableCell>Wynik</TableCell>
                                        <TableCell>Ostatnia aktualizacja</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {participants
                                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                        .map((p, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{p.username}</TableCell>
                                                <TableCell>{p.score}</TableCell>
                                                <TableCell>
                                                    {new Date(p.lastUpdated).toLocaleString("pl-PL", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[10]}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

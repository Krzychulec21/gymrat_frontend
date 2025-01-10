import React, {useEffect, useState} from 'react';
import {deleteWorkoutSession, getUserWorkouts} from '../../service/workoutService';
import {
    Box,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from '@mui/material';
import {Delete, Edit, KeyboardArrowDown, KeyboardArrowUp} from '@mui/icons-material';
import WorkoutSessionDialog from './WorkoutSessionDialog';
import Button from "@mui/material/Button";

const WorkoutSessions = ({refresh, onWorkoutChanged}) => {
    const [workouts, setWorkouts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('date');
    const [totalElements, setTotalElements] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [workoutIdToDelete, setWorkoutIdToDelete] = useState(null);

    const categoryMapping = {
        "NOGI": "Nogi",
        "BARKI": "Barki",
        "PLECY": "Plecy",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "KLATKA_PIERSIOWA": "Klatka piersiowa",
        "BRZUCH": "Brzuch"
    };


    const fetchWorkouts = async () => {
        try {
            const data = await getUserWorkouts(page, rowsPerPage, orderBy, order);
            setWorkouts(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching workout sessions", error);
        }
    };

    const handleWorkoutChanged = () => {
        fetchWorkouts();
        if (onWorkoutChanged) {
            onWorkoutChanged();
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, [page, order, orderBy, refresh]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleEdit = (workout) => {
        setEditingWorkout(workout);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteWorkoutSession(id);
            handleWorkoutChanged()
        } catch (error) {
            console.error("Error deleting workout session", error);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEditingWorkout(null);
    };

    const handleConfirmDelete = () => {
        handleDelete(workoutIdToDelete);
        setOpenDeleteDialog(false)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    }

    const handleDeleteClick = (id) => {
        setOpenDeleteDialog(true);
        setWorkoutIdToDelete(id);
    }

    const Row = (props) => {
        const {row} = props;
        const [open, setOpen] = useState(false);


        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                        </IconButton>
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.note.length > 50 ? row.note.substring(0, 50) + '...' : row.note}</TableCell>
                    <TableCell>{row.numberOfExercises}</TableCell>
                    <TableCell>{categoryMapping[row.mainCategory]}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={5}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" gutterBottom component="div">
                                        Szczegóły sesji treningowej
                                    </Typography>
                                    <Box>
                                        <IconButton onClick={() => handleEdit(row)} color="primary">
                                            <Edit/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(row.id)} color="secondary">
                                            <Delete/>
                                        </IconButton>
                                    </Box>
                                </Box>
                                {row.exerciseSessions.map((session, index) => (
                                    <Box key={index} marginBottom={2}>
                                        <Typography variant="subtitle1">{session.exerciseName}</Typography>
                                        <ul>
                                            {session.sets.map((set, idx) => (
                                                <li key={idx}>
                                                    {set.reps} powtórzeń / {set.weight} kg
                                                </li>
                                            ))}
                                        </ul>
                                    </Box>
                                ))}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    };

    return (
        <>
            <Typography sx={{textAlign: 'center', mt: 4}} variant="h4">Historia treningów</Typography>
            <TableContainer sx={{backgroundColor: '#252525', borderRadius: 3, boxShadow: 3, mt: 2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell sortDirection={orderBy === 'date' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'date'}
                                    direction={orderBy === 'date' ? order : 'asc'}
                                    onClick={(event) => handleRequestSort(event, 'date')}
                                >
                                    Data
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Notatka</TableCell>
                            <TableCell>Ilość ćwiczeń</TableCell>
                            <TableCell>Główna kategoria</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workouts.map((workout) => (
                            <Row key={workout.id} row={workout}/>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[8]}
                />
            </TableContainer>
            {openDialog && (
                <WorkoutSessionDialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    initialValues={editingWorkout}
                    isEditMode={true}
                    onWorkoutAdded={handleWorkoutChanged}
                />
            )}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć trening? Wszystkie postępy z tego treningu zostaną wymazane.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} variant="secondAction">
                        Anuluj
                    </Button>
                    <Button onClick={handleConfirmDelete}>
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WorkoutSessions;

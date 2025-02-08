import React, {useEffect, useMemo, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    TablePagination,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import {getAllExercisesPaginate, saveExercise, updateExercise} from "../../service/exerciseService";
import {getExerciseInfo} from "../../service/workoutService";
import {useSnackbar} from "../../context/SnackbarContext";

const AdminExercise = () => {
    const [exercises, setExercises] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("name");
    const [totalElements, setTotalElements] = useState(0);
    const [exerciseInfo, setExerciseInfo] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);
    const {showSnackbar} = useSnackbar();

    const categoryOptions = useMemo(
        () => [
            {value: "NOGI", label: "Nogi"},
            {value: "BARKI", label: "Barki"},
            {value: "PLECY", label: "Plecy"},
            {value: "BICEPS", label: "Biceps"},
            {value: "TRICEPS", label: "Triceps"},
            {value: "KLATKA_PIERSIOWA", label: "Klatka piersiowa"},
            {value: "BRZUCH", label: "Brzuch"},
        ],
        []
    );

    const validationSchema = Yup.object({
        name: Yup.string().required("Nazwa ćwiczenia jest wymagana"),
        difficultyLevel: Yup.string().required("Poziom trudności jest wymagany"),
        categoryName: Yup.string().required("Kategoria jest wymagana"),
        description: Yup.string().required("Opis jest wymagany"),
        videoId: Yup.string().nullable(),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            difficultyLevel: "",
            categoryName: "",
            description: "",
            videoId: "",
        },
        validationSchema,
        onSubmit: async (values, {resetForm}) => {
            try {
                if (editingExercise) {
                    await updateExercise(editingExercise.id, {
                        name: values.name,
                        categoryName: values.categoryName,
                        description: values.description,
                        videoId: values.videoId || null,
                        difficultyLevel: parseInt(values.difficultyLevel, 10),
                    });
                    showSnackbar("Pomyślnie zaktualizowano ćwiczenie")
                } else {
                await saveExercise({
                    name: values.name,
                    categoryName: values.categoryName,
                    description: values.description,
                    videoId: values.videoId || null,
                    difficultyLevel: parseInt(values.difficultyLevel, 10),
                });
                showSnackbar("Pomyślnie dodano ćwiczenie");
            }
                setOpenDialog(false);
                setEditingExercise(null);
                resetForm();
                fetchExercises();
            } catch (error) {
                showSnackbar("Wystąpił nieoczekiwany błąd", "error");
                console.error("Błąd podczas zapisywania ćwiczenia:", error);
            }
        },
    });


    const fetchExercises = async () => {
        try {
            const data = await getAllExercisesPaginate(page, rowsPerPage, orderBy, order);
            setExercises(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Błąd podczas pobierania ćwiczeń:", error);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, [page, order, orderBy]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEditExercise = async (exercise) => {
        try {
            const data = await getExerciseInfo(exercise.id);
            console.log("dane" + data.videoId)
            formik.setValues({
                name: exercise.name,
                difficultyLevel: exercise.difficultyLevel.toString(),
                description: data.description.join("\n"),
                categoryName: exercise.categoryName,
                videoId: data.videoId || "",
            });
            setEditingExercise(exercise);
            setOpenDialog(true);
        } catch (error) {
            console.error("Błąd podczas pobierania danych ćwiczenia:", error);
        }
    };

    return (
        <Box
            sx={{
                padding: "20px",
                backgroundColor: "#2C2C2C",
                borderRadius: "8px",
                color: "white",
                width: "100%",
                minWidth: {md: "650px"},
                maxWidth: "100%",
                margin: "auto",
                overflowX: "hidden",
            }}
        >
            <Typography variant="h4" sx={{mb: 2, textAlign: "center"}}>
                Zarządzanie ćwiczeniami
            </Typography>
            <Button variant="contained"
                    onClick={() => {
                        setEditingExercise(null);
                        formik.resetForm();
                        setOpenDialog(true);
                    }}
                    sx={{mb: 2}}>
                Dodaj nowe ćwiczenie
            </Button>
            <TableContainer
                component={Box}
                sx={{
                    overflowX: "auto",
                    width: "100%",
                    maxWidth: "100%",
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={(event) => handleRequestSort(event, 'name')}
                                       style={{cursor: 'pointer'}}>
                                Nazwa {orderBy === 'name' && (order === 'asc' ? '⬆' : '⬇')}
                            </TableCell>
                            <TableCell onClick={(event) => handleRequestSort(event, 'categoryName')}
                                       style={{cursor: 'pointer'}}>
                                Kategoria {orderBy === 'categoryName' && (order === 'asc' ? '⬆' : '⬇')}
                            </TableCell>
                            <TableCell>
                                Poziom trudności
                            </TableCell>
                            <TableCell>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                                <TableCell>{exercise.name}</TableCell>
                                <TableCell>
                                    {categoryOptions.find((c) => c.value === exercise.categoryName)?.label}
                                </TableCell>
                                <TableCell>{exercise.difficultyLevel}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleEditExercise(exercise)}
                                    >
                                        Edytuj
                                    </Button>
                                </TableCell>
                            </TableRow>
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingExercise ? "Edytuj ćwiczenie" : "Dodaj nowe ćwiczenie"}</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            label="Nazwa ćwiczenia"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            fullWidth
                            margin="normal"
                        />
                        <FormControl component="fieldset" margin="normal" fullWidth>
                            <Typography component="legend">Poziom trudności</Typography>
                            <RadioGroup
                                name="difficultyLevel"
                                value={formik.values.difficultyLevel}
                                onChange={formik.handleChange}
                                row
                            >
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <FormControlLabel
                                        key={level}
                                        value={level.toString()}
                                        control={<Radio/>}
                                        label={level.toString()}
                                    />
                                ))}
                            </RadioGroup>
                            {formik.touched.difficultyLevel && formik.errors.difficultyLevel && (
                                <Typography color="error" variant="caption">
                                    {formik.errors.difficultyLevel}
                                </Typography>
                            )}
                        </FormControl>
                        <TextField
                            label="Kategoria"
                            name="categoryName"
                            value={formik.values.categoryName}
                            onChange={formik.handleChange}
                            select
                            fullWidth
                            margin="normal"
                            error={formik.touched.categoryName && Boolean(formik.errors.categoryName)}
                            helperText={formik.touched.categoryName && formik.errors.categoryName}
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Opis (każdy punkt w nowej linii)"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <TextField
                            label="ID filmu YouTube"
                            name="videoId"
                            value={formik.values.videoId}
                            onChange={formik.handleChange}
                            fullWidth
                            margin="normal"
                            error={formik.touched.videoId && Boolean(formik.errors.videoId)}
                            helperText={formik.touched.videoId && formik.errors.videoId}
                        />
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Anuluj</Button>
                            <Button type="submit" variant="contained">
                                Dodaj
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AdminExercise;

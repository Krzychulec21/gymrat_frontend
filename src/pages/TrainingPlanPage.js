import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControl, FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField, Typography,
} from "@mui/material";
import {getAllTrainingPlans, toggleFavorite} from "../service/trainingPlanService";
import {useLocation, useNavigate} from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import TrainingPlanForm from "../components/trainingPlan/TrainingPlanForm";
import validationSchema from "../components/trainingPlan/TrainingPlanValidationSchema";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import Tooltip from "@mui/material/Tooltip";
import Slide from "@mui/material/Slide";
import {useSnackbar} from "../context/SnackbarContext";


const TrainingPlansPage = () => {
    const { showSnackbar } = useSnackbar();
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(3);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("likeCount");
    const [filters, setFilters] = useState({
        categories: [],
        difficultyLevels: [],
        authorNickname: "",
    });
    const [authorNicknameInput, setAuthorNicknameInput] = useState("");
    const categoriesList = [
        "NOGI", "BARKI", "BICEPS", "TRICEPS", "KLATKA_PIERSIOWA", "BRZUCH"
    ];
    const difficultyLevels = [1, 2, 3, 4, 5];
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const [openForm, setOpenForm] = useState(false);

    const categoryMapping = {
        "NOGI": "Nogi",
        "BARKI": "Barki",
        "PLECY": "Plecy",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "KLATKA_PIERSIOWA": "Klatka piersiowa",
        "BRZUCH": "Brzuch"
    };

    const translateCategory = (category) => {
        return categoryMapping[category] || category;
    };


    const translateCategories = (categories) => {
        return categories.map(category => translateCategory(category));
    };

    const onUpdate = () => {
        fetchTrainingPlans();
    }

    useEffect(() => {
        fetchTrainingPlans();
    }, [page, order, orderBy, filters]);

    const fetchTrainingPlans = async () => {
        try {
            const params = {
                page,
                size,
                sortField: orderBy,
                sortDirection: order,
                categories: filters.categories,
                difficultyLevels: filters.difficultyLevels,
                authorNickname: filters.authorNickname,
                onlyFavorites: filters.onlyFavorites
            };
            const data = await getAllTrainingPlans(params);
            setTrainingPlans(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching training plans:", error);
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (event) => {
        const {name, value} = event.target;
        setFilters((prev) => ({...prev, [name]: value}));
    };

    const handleAuthorNicknameChange = (event) => {
        setAuthorNicknameInput(event.target.value);
    };

    const handleAuthorNicknameBlur = () => {
        setFilters((prev) => ({...prev, authorNickname: authorNicknameInput}));
    };

    const handleClearFilters = () => {
        setFilters({
            categories: [],
            difficultyLevels: [],
            authorNickname: "",
        });
        setAuthorNicknameInput("");
    };

    const handleRowClick = (id) => {
        navigate(`/plans/${id}`);
    };


    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
    };

    const handleToggleFavorite = async (id) => {
        try {
            await toggleFavorite(id);
            fetchTrainingPlans();
            showSnackbar("Plan treningowy zdodany do polubionych!", "success");

        } catch (error) {
            console.error(error);
        }

    }


    return (
        <Box sx={{
            padding: "20px",
            backgroundColor: "#2C2C2C",
            borderRadius: "8px",
            color: "white",
            width: '90%',
            margin: 'auto'
        }}>
            <Typography sx={{textAlign: 'center'}} variant="h4">Plany treningowe społeczności</Typography>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', mt:2 }}>
                <Button
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ marginBottom: '10px' }}
                >
                    {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
                </Button>
                <Button
                    onClick={handleOpenForm}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                    }}
                >
                    Dodaj plan
                </Button>
            </Box>

            {showFilters && (
                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                    <FormControl>
                        <InputLabel>Kategorie</InputLabel>
                        <Select
                            color="blue"
                            multiple
                            value={filters.categories}
                            onChange={handleFilterChange}
                            name="categories"
                            label="Kategorie"
                            renderValue={(selected) => translateCategories(selected).join(", ")}
                        >
                            {categoriesList.map((category) => (
                                <MenuItem key={category} value={category}>
                                    <Checkbox checked={filters.categories.indexOf(category) > -1}/>
                                    {translateCategory(category)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Difficulty Level Filter */}
                    <FormControl>
                        <InputLabel style={{color: "white"}}>Poziom trudności</InputLabel>
                        <Select
                            multiple
                            value={filters.difficultyLevels}
                            onChange={handleFilterChange}
                            name="difficultyLevels"
                            label="Poziom trudności"
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {difficultyLevels.map((level) => (
                                <MenuItem key={level} value={level}>
                                    <Checkbox checked={filters.difficultyLevels.indexOf(level) > -1}/>
                                    {level}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Author Filter */}
                    <TextField
                        label="Użytkownik"
                        name="authorNickname"
                        value={authorNicknameInput}
                        onChange={handleAuthorNicknameChange}
                        onBlur={handleAuthorNicknameBlur}
                        InputLabelProps={{style: {color: "white"}}}
                        InputProps={{style: {color: "white"}}}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.onlyFavorites || false}
                                onChange={(event) => setFilters(prev => ({ ...prev, onlyFavorites: event.target.checked }))}
                            />
                        }
                        label="Tylko ulubione"
                    />
                    <Tooltip title="Wyczyść filtry" placement="top"><IconButton onClick={handleClearFilters}>
                        <ClearIcon/>
                    </IconButton></Tooltip>
                </Box>
            )}
            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sortDirection={orderBy === "name" ? order : false}>
                            <TableSortLabel
                                active={orderBy === "name"}
                                direction={orderBy === "name" ? order : "asc"}
                                onClick={() => handleRequestSort("name")}
                            >
                                Nazwa
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Autor</TableCell>
                        <TableCell>Kategorie</TableCell>
                        <TableCell sortDirection={orderBy === "difficultyLevel" ? order : false}>
                            <TableSortLabel
                                active={orderBy === "difficultyLevel"}
                                direction={orderBy === "difficultyLevel" ? order : "asc"}
                                onClick={() => handleRequestSort("difficultyLevel")}
                            >
                                Trudność
                            </TableSortLabel>
                        </TableCell>
                        <TableCell sortDirection={orderBy === "likeCount" ? order : false}>
                            <TableSortLabel
                                active={orderBy === "likeCount"}
                                direction={orderBy === "likeCount" ? order : "asc"}
                                onClick={() => handleRequestSort("likeCount")}
                            >
                                Polubienia
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            Ulubione
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {trainingPlans.map((plan) => (
                        <TableRow key={plan.id} hover onClick={() => handleRowClick(plan.id)}
                                  style={{cursor: "pointer"}}>
                            <TableCell>{plan.name}</TableCell>
                            <TableCell>{plan.authorNickname}</TableCell>
                            <TableCell>{translateCategories(plan.categories).join(", ")}</TableCell>
                            <TableCell>
                                {[...Array(plan.difficultyLevel)].map((_, index) => (
                                    <FitnessCenterOutlinedIcon fontSize="small" key={index}/>
                                ))}
                            </TableCell>
                            <TableCell>{plan.likeCount}</TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleToggleFavorite(plan.id, plan.isFavorite);
                                    }}
                                >
                                    {plan.isFavorite ? (
                                        <StarIcon style={{ color: "gold" }} />
                                    ) : (
                                        <StarBorderIcon style={{ color: "gray" }} />
                                    )}
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table></TableContainer>
            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                rowsPerPageOptions={[10]}
            />
            <TrainingPlanForm
                open={openForm}
                onClose={handleCloseForm}
                initialValues={null}
                isEditMode={false}
                validationSchema={validationSchema}
                onUpdate={onUpdate}
                showSnackbar={showSnackbar}

            />
        </Box>
    );
};

export default TrainingPlansPage;

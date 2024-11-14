import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
} from "@mui/material";
import {getAllTrainingPlans} from "../service/trainingPlanService";
import {useNavigate} from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import TrainingPlanForm from "../components/trainingPlan/TrainingPlanForm";
import validationSchema from "../components/trainingPlan/TrainingPlanValidationSchema";

const TrainingPlansPage = () => {
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


    return (
        <Box sx={{
            padding: "20px",
            backgroundColor: "#2C2C2C",
            borderRadius: "8px",
            color: "white",
            width: '90%',
            margin: 'auto'
        }}>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
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
                    <IconButton onClick={handleClearFilters}>
                        <ClearIcon/>
                    </IconButton>
                </Box>
            )}
            <TableContainer><Table>
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
            />
        </Box>
    );
};

export default TrainingPlansPage;

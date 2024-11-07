import React, { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    TableSortLabel,
    Checkbox,
    TextField,
    Button,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
} from "@mui/material";
import { getAllTrainingPlans } from "../service/trainingPlanService";
import { useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

const TrainingPlansPage = () => {
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("likeCount");
    const [filters, setFilters] = useState({
        categories: [],
        difficultyLevels: [],
        authorNickname: "",
    });
    const [categoriesList, setCategoriesList] = useState([
    "NOGI"
    ]);
    const [difficultyLevels] = useState([1, 2, 3, 4, 5]);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      getPlansSummary();
    }, [page, order, orderBy, filters]);

    const fetchTrainingPlans = async () => {
        try {
            const params = {
                page,
                size,
                sortField: orderBy,
                sortDirection: order,
                categories: filters.categories.join(","),
                difficultyLevels: filters.difficultyLevels.join(","),
                authorNickname: filters.authorNickname,
            };
            const data = await getAllTrainingPlans(params);
            setTrainingPlans(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching training plans:", error);
        }
    };

    const getPlansSummary = async () => {
            const data = await getAllTrainingPlans();
            setTrainingPlans(data.content);
            console.log("essa dane otrzymane: ", data.content)
    }

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            categories: [],
            difficultyLevels: [],
            authorNickname: "",
        });
    };

    const handleRowClick = (id) => {
        navigate(`/plans/${id}`);
    };

    return (
        <Box sx={{ padding: "20px", backgroundColor: "#2C2C2C", borderRadius: "8px", color: "white" }}>
            <Button
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ marginBottom: "10px" }}
            >
                {showFilters ? "Ukryj filtry" : "Pokaż filtry"}
            </Button>
            {showFilters && (
                <Box sx={{ marginBottom: "20px" }}>
                    {/* Category Filter */}
                    <FormControl sx={{ marginRight: "10px", minWidth: "200px" }}>
                        <InputLabel style={{ color: "white" }}>Kategorie</InputLabel>
                        <Select
                            multiple
                            value={filters.categories}
                            onChange={handleFilterChange}
                            name="categories"
                            label="Kategorie"
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {categoriesList.map((category) => (
                                <MenuItem key={category} value={category}>
                                    <Checkbox checked={filters.categories.indexOf(category) > -1} />
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Difficulty Level Filter */}
                    <FormControl sx={{ marginRight: "10px", minWidth: "200px" }}>
                        <InputLabel style={{ color: "white" }}>Poziom trudności</InputLabel>
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
                                    <Checkbox checked={filters.difficultyLevels.indexOf(level) > -1} />
                                    {level}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Author Filter */}
                    <TextField
                        label="Użytkownik"
                        name="authorNickname"
                        value={filters.authorNickname}
                        onChange={handleFilterChange}
                        sx={{ marginRight: "10px" }}
                        InputLabelProps={{ style: { color: "white" } }}
                        InputProps={{ style: { color: "white" } }}
                    />
                    <IconButton onClick={handleClearFilters}>
                        <ClearIcon />
                    </IconButton>
                </Box>
            )}
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {trainingPlans.map((plan) => (
                        <TableRow key={plan.id} hover onClick={() => handleRowClick(plan.id)} style={{ cursor: "pointer" }}>
                            <TableCell>{plan.name}</TableCell>
                            <TableCell>{plan.authorNickname}</TableCell>
                            <TableCell>{plan.categories.join(", ")}</TableCell>
                            <TableCell>{plan.difficultyLevel}</TableCell>
                            <TableCell>{plan.likeCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                rowsPerPageOptions={[10]}
            />
        </Box>
    );
};

export default TrainingPlansPage;

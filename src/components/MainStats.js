import {Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import React, {useEffect, useState} from "react";
import Slide from "@mui/material/Slide";
import AddWorkoutSessionDialog from "./workout/AddWorkoutSessionDialog";
import CustomCard from "./display/CustomCard";
import GeneralStatsCard from "./workout/GeneralStatsCard";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {getTopCategoriesForUser} from "../service/workoutService";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MainStats = () => {
    const [refresh, setRefresh] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [topCategories, setTopCategories] = useState([]);
    const handleDialogClose = (event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        setOpenDialog(false);
    }


    const handleAddWorkoutButton = () => {
        setOpenDialog(true);
    }

    const handleWorkoutAdded = () => {
        setRefresh(!refresh);
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const loadTopCategoriesForUser = async () => {
        const data = await getTopCategoriesForUser();
        setTopCategories(data);
    }
    useEffect(() => {
        loadTopCategoriesForUser();
    }, [])
    return (
        <Box sx={{
            position: 'relative',
            backgroundColor: '#2C2C2C',
            borderRadius: '8px',
            maxWidth: {xs: '95%', lg: '60%'},
            padding: '20px',
            margin: '0 auto',
            color: 'white',
            minWidth: {xs: '80%', lg: '55%'},
        }}
        >
            <Button sx={{
                position:'absolute',
                top: 10,
                right: 10
            }} onClick={handleAddWorkoutButton}>Dodaj trening</Button>
            <AddWorkoutSessionDialog open={openDialog} onClose={handleDialogClose} Transition={Transition} onWorkoutAdded={handleWorkoutAdded}/>
            <GeneralStatsCard refresh={refresh}/>
            <PieChart width={400} height={400}>
                <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="category"
                >
                    {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </Box>
    );
};

export default MainStats;
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {addLike, deleteTrainingPlan, getTrainingPlanById,} from "../service/trainingPlanService";
import {useNavigate, useParams} from "react-router-dom";
import TrainingPlanForm from "./TrainingPlanForm";
import CommentsSection from "./CommentSection";
import {getUser} from "../service/userService";
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';


const TrainingPlanDetails = () => {
    const {id} = useParams();
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const categoryMapping = {
        "NOGI": "Nogi",
        "BARKI": "Barki",
        "PLECY": "Plecy",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "KLATKA_PIERSIOWA": "Klatka piersiowa",
        "BRZUCH": "Brzuch"
    };


    useEffect(() => {
        fetchTrainingPlan();
        getCurrentUser();
    }, [id]);

    const translateCategory = (category) => {
        return categoryMapping[category] || category;
    };

    const translateCategories = (categories) => {
        return categories.map(category => translateCategory(category));
    };
    const fetchTrainingPlan = async () => {
        try {
            const data = await getTrainingPlanById(id);
            setTrainingPlan(data);
            setLikeCount(data.likeCount);
        } catch (error) {
            console.error("Error fetching training plan:", error);
        }
    };

    const getCurrentUser = async () => {
        try {
            const user = await getUser();
            setCurrentUser(user);
        } catch (error) {
            console.error("Error fetching current user");
        }
    };

    const handleLike = async (isLike) => {
        try {
            await addLike(id, isLike);
            // Refresh the training plan data
            fetchTrainingPlan();
            console.log("dane z training plan", trainingPlan)
            console.log("user obiekt", currentUser)
        } catch (error) {
            console.error("Error adding like:", error);
        }
    };

    const handleEdit = () => {
        setOpenEditForm(true);
    };

    const handleDelete = async () => {
        try {
            await deleteTrainingPlan(id);
            navigate("/plans");
        } catch (error) {
            console.error("Error deleting training plan:", error);
        }
    };

    if (!trainingPlan) {
        return <Typography>Ładowanie...</Typography>;
    }
    const isAuthor = currentUser && currentUser.nickname === trainingPlan.authorNickname;

    return (
        <Box sx={{
            padding: "20px",
            backgroundColor: "#2C2C2C",
            borderRadius: "8px",
            color: "white",
            margin: "auto",
            maxWidth: '80%'
        }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">{trainingPlan.name}</Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6" sx={{marginRight: "10px"}}>
                        {likeCount}
                    </Typography>
                    <IconButton
                        onClick={() => handleLike(true)}
                    >
                        <ThumbUpIcon sx={{color: trainingPlan.userReaction === 'like' ? 'green' : 'inherit'}}/>
                    </IconButton>
                    <IconButton
                        onClick={() => handleLike(false)}
                    >
                        <ThumbDownIcon sx={{color: trainingPlan.userReaction === 'dislike' ? 'red' : 'inherit'}}/>
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{mb: 5}}><Typography variant="subtitle1" gutterBottom>
                Autor: {trainingPlan.authorNickname}
            </Typography>
                <Typography variant="subtitle1" gutterBottom display="inline-flex" alignItems="center">
                    Poziom trudności:
                    <Box display="inline-flex" alignItems="center" sx={{marginLeft: "8px"}}>
                        {[...Array(5)].map((_, index) => (
                            <Box key={index} sx={{display: "flex", alignItems: "center"}}>
                                {index < trainingPlan.difficultyLevel ? (
                                    <FitnessCenterOutlinedIcon sx={{verticalAlign: "middle"}}/>
                                ) : (
                                    <FitnessCenterIcon sx={{color: 'black', verticalAlign: "middle"}}/>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    Kategorie: {translateCategories(trainingPlan.categories).join(', ')}
                </Typography>
            </Box>

            <Box sx={{mb: 4, maxWidth: {xs: '95%', lg: '80%'}}}>
                <Typography variant="h6" sx={{mb: 1}}>Opis:</Typography>
                <Typography variant="body1" gutterBottom sx={{wordBreak: 'break-word'}}>
                    {trainingPlan.description} sadadddddddddddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddd
                    dddddddddddddddddddadaddddddddddddddddddddddddddddddddddddddddddda
                    dadddddddddddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddddddddddddddddddddddadadddddddd
                    dddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddddddddddddddddddddddadadddddddddddddddddddddddddddddddddddddddddddadaddddddddddddddddddddddddddddddddddddddddddd
                </Typography></Box>

            <Box sx={{display: 'flex', flexDirection: "column"}}>
                <Typography variant="h6" gutterBottom sx={{textAlign: 'center'}}>
                    Ćwiczenia:
                </Typography>
                {trainingPlan.exercises.map((exercise, index) => (
                    <Box key={exercise.id} sx={{
                        maxWidth: {xs: '80%', lg: '70%'},
                        marginBottom: "10px",
                        backgroundColor: index % 2 === 0 ? "#363636" : "#444444",
                        borderRadius: "4px",
                        padding: '5px',
                    }}>
                        <Typography variant="h6">{exercise.exerciseName}</Typography>
                        <Typography variant="body2">{exercise.customInstructions}</Typography>
                    </Box>
                ))}
            </Box>
            {isAuthor && (
                <Box sx={{marginTop: "20px"}}>
                    <Button startIcon={<EditIcon/>} onClick={handleEdit} sx={{marginRight: "10px"}}>
                        Edytuj
                    </Button>
                    <Button
                        startIcon={<DeleteIcon/>}
                        onClick={() => setOpenDeleteDialog(true)}
                        color="secondary"
                    >
                        Usuń
                    </Button>
                </Box>
            )}
            <CommentsSection trainingPlanId={id}/>
            {/* Edit Form Dialog */}
            {openEditForm && (
                <TrainingPlanForm
                    open={openEditForm}
                    onClose={() => {
                        setOpenEditForm(false);
                        fetchTrainingPlan();
                    }}
                    initialValues={trainingPlan}
                    isEditMode={true}
                />
            )}
            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć ten plan treningowy?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Anuluj</Button>
                    <Button onClick={handleDelete} color="secondary">
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TrainingPlanDetails;

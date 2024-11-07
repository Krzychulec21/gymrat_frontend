import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    getTrainingPlanById,
    addLike,
    deleteTrainingPlan,
} from "../service/trainingPlanService";
import { useParams, useNavigate } from "react-router-dom";
import TrainingPlanForm from "./TrainingPlanForm";
import CommentsSection from "./CommentSection";
import {useAuth} from "../context/AuthContext";

const TrainingPlanDetails = () => {
    const { id } = useParams();
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchTrainingPlan();
    }, [id]);

    const fetchTrainingPlan = async () => {
        try {
            const data = await getTrainingPlanById(id);
            setTrainingPlan(data);
            setLikeCount(data.likeCount);
        } catch (error) {
            console.error("Error fetching training plan:", error);
        }
    };

    const handleLike = async (isLike) => {
        try {
            await addLike(id, isLike);
            // Refresh the training plan data
            fetchTrainingPlan();
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

    const isAuthor = user && user.nickname === trainingPlan.authorNickname;

    return (
        <Box sx={{ padding: "20px", backgroundColor: "#2C2C2C", borderRadius: "8px", color: "white" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">{trainingPlan.name}</Typography>
                <Box display="flex" alignItems="center">
                    <Typography variant="h6" sx={{ marginRight: "10px" }}>
                        {likeCount}
                    </Typography>
                    <IconButton onClick={() => handleLike(true)} color="primary">
                        <ThumbUpIcon />
                    </IconButton>
                    <IconButton onClick={() => handleLike(false)} color="secondary">
                        <ThumbDownIcon />
                    </IconButton>
                </Box>
            </Box>
            <Typography variant="subtitle1" gutterBottom>
                Autor: {trainingPlan.authorNickname}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {trainingPlan.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
                Poziom trudności: {trainingPlan.difficultyLevel}
            </Typography>
            <Typography variant="body2" gutterBottom>
                Kategorie: {trainingPlan.categories.join(", ")}
            </Typography>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Ćwiczenia:
                </Typography>
                {trainingPlan.exercises.map((exercise) => (
                    <Box key={exercise.id} sx={{ marginBottom: "10px" }}>
                        <Typography variant="subtitle1">{exercise.exerciseName}</Typography>
                        <Typography variant="body2">{exercise.customInstructions}</Typography>
                    </Box>
                ))}
            </Box>
            {isAuthor && (
                <Box sx={{ marginTop: "20px" }}>
                    <Button startIcon={<EditIcon />} onClick={handleEdit} sx={{ marginRight: "10px" }}>
                        Edytuj
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => setOpenDeleteDialog(true)}
                        color="secondary"
                    >
                        Usuń
                    </Button>
                </Box>
            )}
            <CommentsSection trainingPlanId={id} />
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

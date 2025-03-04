import {Box, Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useTranslation } from "react-i18next";

const AboutExerciseDialog = ({open, onClose, exerciseInfo}) => {
    const {t} = useTranslation("common");

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={open}
            onClose={onClose}>
            <DialogTitle>
                {exerciseInfo?.exerciseName}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon/>
            </IconButton>

            <DialogContent>
                {exerciseInfo && exerciseInfo.difficultyLevel && (
                    <Typography variant="subtitle1" gutterBottom display="inline-flex" alignItems="center">
                        {t("exerciseInfo.difficultyLevel")}
                        <Box display="inline-flex" alignItems="center" sx={{marginLeft: "8px"}}>
                            {[...Array(5)].map((_, index) => (
                                <Box key={index} sx={{display: "flex", alignItems: "center"}}>
                                    {index < exerciseInfo.difficultyLevel ? (
                                        <FitnessCenterOutlinedIcon sx={{verticalAlign: "middle"}}/>
                                    ) : (
                                        <FitnessCenterIcon sx={{color: 'black', verticalAlign: "middle"}}/>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Typography>
                )}

                <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    width: '100%',
                    marginBottom: '16px'
                }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${exerciseInfo?.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    ></iframe>
                </div>

                {Array.isArray(exerciseInfo?.description) ? (
                    <ol>
                        {exerciseInfo.description.map((step, index) => (
                            <Typography component="li" key={index} variant="body1">
                                {step}
                            </Typography>
                        ))}
                    </ol>
                ) : (
                    <Typography variant="body1" sx={{wordBreak: 'break-word'}}>
                        {exerciseInfo?.description || "Brak opisu dla tego ćwiczenia"}
                    </Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AboutExerciseDialog;
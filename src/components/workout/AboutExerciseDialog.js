import {Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, {useEffect, useState} from "react";
import {getExerciseInfo} from "../../service/workoutService";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AboutExerciseDialog = ({open, onClose, exerciseInfo}) => {


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
import React, {memo, useEffect, useState} from "react";
import {Field, FieldArray, useFormikContext} from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import {Button, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import {getExerciseInfo} from "../../service/workoutService";
import CloseIcon from "@mui/icons-material/Close";

const ExerciseField = memo(({exerciseOptions, exerciseIndex, removeExercise}) => {
    const {values, touched, errors, setFieldValue} = useFormikContext();
    const [open, setOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [exerciseInfo, setExerciseInfo] = useState(null);

    const handleOpenDescription = (exercise) => {
        setSelectedExercise(exercise);
        setOpen(true);
    };

    const loadExerciseInfo = async (exerciseId) => {
        const data = await getExerciseInfo(exerciseId);
        setExerciseInfo(data);
        console.log("otrzymane dane: ", data)
    }

    useEffect(() => {
        loadExerciseInfo();
    }, []);

    return (
        <div style={{marginBottom: '20px'}}>
            <Field name={`exercises[${exerciseIndex}].exerciseId`}>
                {({field, meta}) => (
                    <Autocomplete
                        options={exerciseOptions}
                        getOptionLabel={(option) => option.name}
                        groupBy={(option) => option.categoryName}
                        value={
                            exerciseOptions.find(option => option.id === field.value) || null
                        }
                        onChange={(event, value) =>
                            setFieldValue(field.name, value ? value.id : '')
                        }
                        renderOption={(props, option) => (
                            <li {...props}
                                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>{option.name}</span>
                                <Tooltip title="Informacje o ćwiczeniu" placement="top">
                                    <IconButton
                                        onClick={(e) => {
                                            loadExerciseInfo(option.id)
                                            e.stopPropagation();
                                            handleOpenDescription(option);
                                        }}
                                    >
                                        <HelpOutlineIcon/>
                                    </IconButton>
                                </Tooltip>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Wybierz ćwiczenie"
                                margin="normal"
                                error={meta.touched && Boolean(meta.error)}
                                helperText={meta.touched && meta.error}
                            />
                        )}
                    />
                )}
            </Field>

            <FieldArray name={`exercises[${exerciseIndex}].sets`}>
                {({push: pushSet, remove: removeSet}) => (
                    values.exercises[exerciseIndex].sets.map((set, setIndex) => (
                        <div key={setIndex} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                            <Field
                                name={`exercises[${exerciseIndex}].sets[${setIndex}].reps`}
                                as={TextField}
                                label="Powtórzenia"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps && Boolean(errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps)}
                                helperText={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps && errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps}
                            />
                            <Field
                                name={`exercises[${exerciseIndex}].sets[${setIndex}].weight`}
                                as={TextField}
                                label="Ciężar (kg)"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight && Boolean(errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight)}
                                helperText={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight && errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight}
                            />
                            <IconButton onClick={() => removeSet(setIndex)}
                                        disabled={values.exercises[exerciseIndex].sets.length === 1}>
                                <RemoveIcon/>
                            </IconButton>
                            <IconButton onClick={() => pushSet({reps: '', weight: ''})}>
                                <AddIcon/>
                            </IconButton>
                        </div>
                    ))
                )}
            </FieldArray>

            <Button onClick={() => removeExercise(exerciseIndex)} disabled={values.exercises.length === 1}>
                Usuń ćwiczenie
            </Button>

            {/* Dialog to display exercise description */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {selectedExercise?.name}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${exerciseInfo?.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                            marginBottom: "16px",
                        }}
                    ></iframe>

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
        </div>
    );
});

export default ExerciseField;

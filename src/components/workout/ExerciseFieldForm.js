import React, {memo, useState} from "react";
import {Field, FieldArray, useFormikContext} from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import {Box, Button, IconButton, TextField} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import {getExerciseInfo} from "../../service/workoutService";
import AboutExerciseDialog from "./AboutExerciseDialog";

const ExerciseFieldForm = memo(({exerciseOptions, exerciseIndex, removeExercise}) => {
    const {values, touched, errors, setFieldValue} = useFormikContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exerciseInfo, setExerciseInfo] = useState(null);

    const categoryMapping = {
        "NOGI": "Nogi",
        "BARKI": "Barki",
        "PLECY": "Plecy",
        "BICEPS": "Biceps",
        "TRICEPS": "Triceps",
        "KLATKA_PIERSIOWA": "Klatka piersiowa",
        "BRZUCH": "Brzuch"
    };


    const handleOpenDescription = async (exerciseId) => {
        try {
            const data = await getExerciseInfo(exerciseId);
            setExerciseInfo(data);
            setDialogOpen(true);
        } catch (error) {
            console.error("Błąd podczas pobierania informacji o ćwiczeniu:", error);
        }
    };

    return (
        <div style={{marginBottom: '20px'}}>
            <Field name={`exercises[${exerciseIndex}].exerciseId`}>
                {({field, meta}) => (
                    <Autocomplete
                        options={exerciseOptions.sort((a, b) =>
                            (a.categoryName > b.categoryName ? 1 : -1))}
                        getOptionLabel={(option) => option.name}
                        groupBy={(option) => categoryMapping[option.categoryName] || option.categoryName}
                        value={
                            exerciseOptions.find(option => option.id === field.value) || null
                        }
                        onChange={(event, value) =>
                            setFieldValue(field.name, value ? value.id : '')
                        }
                        noOptionsText={
                            <span style={{color: 'white'}}>Brak ćwiczenia</span>}
                        renderOption={(props, option) => (
                            <li {...props}
                                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>{option.name}</span>
                                <Tooltip title="Informacje o ćwiczeniu" placement="top">
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenDescription(option.id);
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
                        <div key={setIndex} style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                            <Field
                                sx={{maxWidth: '100px'}}
                                name={`exercises[${exerciseIndex}].sets[${setIndex}].reps`}
                                as={TextField}
                                label="Powtórzenia"
                                type="number"
                                inputProps={{min: 0}}
                                margin="normal"
                                error={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps && Boolean(errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps)}
                                helperText={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps && errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.reps}
                            />
                            <Field
                                name={`exercises[${exerciseIndex}].sets[${setIndex}].weight`}
                                as={TextField}
                                label="Ciężar (kg)"
                                inputProps={{
                                    min: 0,
                                    step: "0.1",
                                    pattern: "^[0-9]*[.,]?[0-9]*$"
                                }}
                                sx={{maxWidth: '100px'}}
                                margin="normal"
                                error={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight && Boolean(errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight)}
                                helperText={touched.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight && errors.exercises?.[exerciseIndex]?.sets?.[setIndex]?.weight}
                            />
                            <Box>
                                <IconButton onClick={() => removeSet(setIndex)}
                                            disabled={values.exercises[exerciseIndex].sets.length === 1}>
                                    <RemoveIcon/>
                                </IconButton>
                                <IconButton onClick={() => pushSet({reps: '', weight: ''})}>
                                    <AddIcon/>
                                </IconButton></Box>
                        </div>
                    ))
                )}
            </FieldArray>
            <Button onClick={() => removeExercise(exerciseIndex)} disabled={values.exercises.length === 1}>
                Usuń ćwiczenie
            </Button>

            <AboutExerciseDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                exerciseInfo={exerciseInfo}
            />

        </div>
    );
});

export default ExerciseFieldForm;

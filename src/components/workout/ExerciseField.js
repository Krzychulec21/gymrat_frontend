import React, {memo} from "react";
import {Field, FieldArray, useFormikContext} from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import {Button, IconButton, TextField} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const ExerciseField = memo(({ exerciseOptions, exerciseIndex, removeExercise }) => {
    const { values, touched, errors, setFieldValue } = useFormikContext();

    return (
        <div style={{ marginBottom: '20px' }}>
            <Field name={`exercises[${exerciseIndex}].exerciseId`}>
                {({ field, meta }) => (
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
                            <li {...props} style={{ color: 'black' }}>
                                {option.name}
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
                {({ push: pushSet, remove: removeSet }) => (
                    values.exercises[exerciseIndex].sets.map((set, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                            <IconButton onClick={() => removeSet(setIndex)} disabled={values.exercises[exerciseIndex].sets.length === 1}>
                                <RemoveIcon />
                            </IconButton>
                            <IconButton onClick={() => pushSet({ reps: '', weight: '' })}>
                                <AddIcon />
                            </IconButton>
                        </div>
                    ))
                )}
            </FieldArray>
            <Button onClick={() => removeExercise(exerciseIndex)} disabled={values.exercises.length === 1}>
                Usuń ćwiczenie
            </Button>
        </div>
    );
});

export default ExerciseField;
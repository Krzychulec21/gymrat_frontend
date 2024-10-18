import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as Yup from 'yup';
import { getAllExercises, saveWorkoutSession } from '../../service/workoutService';

const validationSchema = Yup.object({
    date: Yup.date().required('Data jest wymagana'),
    note: Yup.string(),
    exercises: Yup.array()
        .of(
            Yup.object({
                exerciseId: Yup.number().required('Wybierz ćwiczenie'),
                sets: Yup.array()
                    .of(
                        Yup.object({
                            reps: Yup.number()
                                .required('Podaj liczbę powtórzeń')
                                .min(1, 'Liczba powtórzeń musi być większa niż 0'),
                            weight: Yup.number()
                                .required('Podaj ciężar')
                                .min(0, 'Ciężar musi być większy lub równy 0'),
                        })
                    )
                    .min(1, 'Przynajmniej jeden zestaw jest wymagany'),
            })
        )
        .min(1, 'Przynajmniej jedno ćwiczenie jest wymagane'),
});

const AddWorkoutSessionDialog = ({ open, onClose, Transition }) => {
    const [exerciseOptions, setExerciseOptions] = useState([]);

    useEffect(() => {
        const fetchExercises = async () => {
            const exercises = await getAllExercises();
            const options = exercises.map((exercise) => ({
                id: exercise.id,
                name: exercise.name,
                categoryName: exercise.categoryName,
            }));
            setExerciseOptions(options);
        };

        fetchExercises();
    }, []);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{ style: { backgroundColor: '#161a1d' } }}
        >
            <Formik
                initialValues={{
                    date: new Date().toISOString().split('T')[0],
                    note: '',
                    exercises: [
                        {
                            exerciseId: '',
                            sets: [{ reps: '', weight: '' }],
                        },
                    ],
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    console.log("dane przesylane do metody save z formularza", values)
                    saveWorkoutSession(values)
                        .then(() => {
                            setSubmitting(false);
                            onClose();
                        })
                        .catch((error) => {
                            console.error(error);
                            setSubmitting(false);
                        });
                }}
            >
                {({ values, errors, touched, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                name="date"
                                as={TextField}
                                label="Data"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                margin="normal"
                                error={touched.date && Boolean(errors.date)}
                                helperText={touched.date && errors.date}
                            />
                            <Field
                                name="note"
                                as={TextField}
                                label="Notatka"
                                fullWidth
                                margin="normal"
                                error={touched.note && Boolean(errors.note)}
                                helperText={touched.note && errors.note}
                            />
                            <FieldArray name="exercises">
                                {({ push, remove }) => (
                                    <>
                                        {values.exercises.map((exercise, exerciseIndex) => (
                                            <div key={exerciseIndex} style={{ marginBottom: '20px' }}>
                                                <Field name={`exercises[${exerciseIndex}].exerciseId`}>
                                                    {({ field, form, meta }) => (
                                                        <Autocomplete

                                                            options={exerciseOptions}
                                                            getOptionLabel={(option) => option.name}
                                                            groupBy={(option) => option.categoryName}
                                                            value={
                                                                exerciseOptions.find(
                                                                    (option) => option.id === field.value
                                                                ) || null
                                                            }
                                                            onChange={(event, value) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    value ? value.id : ''
                                                                );
                                                            }}
                                                            renderOption={(props, option) => (
                                                                <li {...props} style={{ color: 'blue' }}>
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
                                                        <>
                                                            {exercise.sets.map((set, setIndex) => (
                                                                <div
                                                                    key={setIndex}
                                                                    style={{
                                                                        display: 'flex',
                                                                        gap: '10px',
                                                                        alignItems: 'center',
                                                                    }}
                                                                >
                                                                    <Field
                                                                        name={`exercises[${exerciseIndex}].sets[${setIndex}].reps`}
                                                                        as={TextField}
                                                                        label="Powtórzenia"
                                                                        type="number"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        error={
                                                                            touched.exercises &&
                                                                            touched.exercises[exerciseIndex] &&
                                                                            touched.exercises[exerciseIndex].sets &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ] &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ].reps &&
                                                                            Boolean(
                                                                                errors.exercises &&
                                                                                errors.exercises[exerciseIndex] &&
                                                                                errors.exercises[exerciseIndex].sets &&
                                                                                errors.exercises[exerciseIndex].sets[
                                                                                    setIndex
                                                                                    ] &&
                                                                                errors.exercises[exerciseIndex].sets[
                                                                                    setIndex
                                                                                    ].reps
                                                                            )
                                                                        }
                                                                        helperText={
                                                                            touched.exercises &&
                                                                            touched.exercises[exerciseIndex] &&
                                                                            touched.exercises[exerciseIndex].sets &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ] &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ].reps &&
                                                                            errors.exercises &&
                                                                            errors.exercises[exerciseIndex] &&
                                                                            errors.exercises[exerciseIndex].sets &&
                                                                            errors.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ] &&
                                                                            errors.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ].reps
                                                                        }
                                                                    />
                                                                    <Field
                                                                        name={`exercises[${exerciseIndex}].sets[${setIndex}].weight`}
                                                                        as={TextField}
                                                                        label="Ciężar (kg)"
                                                                        type="number"
                                                                        fullWidth
                                                                        margin="normal"
                                                                        error={
                                                                            touched.exercises &&
                                                                            touched.exercises[exerciseIndex] &&
                                                                            touched.exercises[exerciseIndex].sets &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ] &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ].weight &&
                                                                            Boolean(
                                                                                errors.exercises &&
                                                                                errors.exercises[exerciseIndex] &&
                                                                                errors.exercises[exerciseIndex].sets &&
                                                                                errors.exercises[exerciseIndex].sets[
                                                                                    setIndex
                                                                                    ] &&
                                                                                errors.exercises[exerciseIndex].sets[
                                                                                    setIndex
                                                                                    ].weight
                                                                            )
                                                                        }
                                                                        helperText={
                                                                            touched.exercises &&
                                                                            touched.exercises[exerciseIndex] &&
                                                                            touched.exercises[exerciseIndex].sets &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ] &&
                                                                            touched.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ].weight &&
                                                                            errors.exercises &&
                                                                            errors.exercises[exerciseIndex] &&
                                                                            errors.exercises[exerciseIndex].sets &&
                                                                            errors.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ] &&
                                                                            errors.exercises[exerciseIndex].sets[
                                                                                setIndex
                                                                                ].weight
                                                                        }
                                                                    />
                                                                    <IconButton
                                                                        onClick={() => removeSet(setIndex)}
                                                                        disabled={exercise.sets.length === 1}
                                                                    >
                                                                        <RemoveIcon />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            pushSet({ reps: '', weight: '' })
                                                                        }
                                                                    >
                                                                        <AddIcon />
                                                                    </IconButton>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </FieldArray>
                                                <Button
                                                    onClick={() => remove(exerciseIndex)}
                                                    disabled={values.exercises.length === 1}
                                                >
                                                    Usuń ćwiczenie
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() =>
                                                push({ exerciseId: '', sets: [{ reps: '', weight: '' }] })
                                            }
                                        >
                                            Dodaj kolejne ćwiczenie
                                        </Button>
                                    </>
                                )}
                            </FieldArray>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose}>Anuluj</Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AddWorkoutSessionDialog;

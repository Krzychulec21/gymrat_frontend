import React, {useEffect, useState} from 'react';
import {Field, FieldArray, Form, Formik} from 'formik';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from '@mui/material';
import {getAllExercises, saveWorkoutSession} from '../../service/workoutService';
import validationSchema from "./ValidationSchema";
import ExerciseField from "./ExerciseField";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


const AddWorkoutSessionDialog = ({ open, onClose, Transition, onWorkoutAdded }) => {
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const today = dayjs().format('YYYY-MM-DD');

    useEffect(() => {
        const fetchExercises = async () => {
            const exercises = await getAllExercises();
            setExerciseOptions(exercises.map(ex => ({
                id: ex.id, name: ex.name, categoryName: ex.categoryName,
            })));
        };
        fetchExercises();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} TransitionComponent={Transition} PaperProps={{ style: { backgroundColor: '#161a1d' }}} title="elo" >
            <Formik
                initialValues={{
                    date: new Date().toISOString().split('T')[0],
                    note: '',
                    exercises: [{ exerciseId: '', sets: [{ reps: '', weight: '' }] }],
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    saveWorkoutSession(values)
                        .then(() => {
                            setSubmitting(false);
                            onClose();
                            onWorkoutAdded();
                        })
                        .catch((error) => {
                            console.error(error);
                            setSubmitting(false);
                        });
                }}
            >
                {({ values, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <DialogTitle>Nowa sesja treningowa</DialogTitle>
                            <Field
                                name="date"
                                as={TextField}
                                label="Data"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                inputProps={{max: today}}
                                margin="normal"
                                InputProps={{
                                    sx: {
                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                            filter: 'invert(1)', // This will invert the icon color to white
                                        },
                                    },
                                }}
                            />
                            <Field
                                name="note"
                                as={TextField}
                                label="Notatka"
                                fullWidth
                                margin="normal"
                            />
                            <FieldArray name="exercises">
                                {({ push, remove }) => (
                                    <>
                                        {values.exercises.map((_, exerciseIndex) => (
                                            <ExerciseField
                                                key={exerciseIndex}
                                                exerciseOptions={exerciseOptions}
                                                exerciseIndex={exerciseIndex}
                                                removeExercise={remove}
                                            />
                                        ))}
                                        <Button onClick={() => push({ exerciseId: '', sets: [{ reps: '', weight: '' }] })}>
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
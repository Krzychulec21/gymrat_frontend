import React, {useEffect, useState} from 'react';
import {Field, FieldArray, Form, Formik} from 'formik';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from '@mui/material';
import {getAllExercises, saveWorkoutSession, updateWorkoutSession} from '../../service/workoutService';
import workoutSessionValidationSchema from "./WorkoutSessionValidationSchema";
import ExerciseFieldForm from "./ExerciseFieldForm";
import dayjs from "dayjs";

const WorkoutSessionDialog = ({ open, onClose, initialValues, isEditMode, onWorkoutAdded}) => {
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

    const defaultInitialValues = initialValues ? {
        date: initialValues.date,
        note: initialValues.note,
        exercises: initialValues.exerciseSessions.map(exerciseSession => ({
            exerciseId: exerciseSession.exerciseId,
            sets: exerciseSession.sets.map(set => ({
                reps: set.reps.toString(),
                weight: set.weight.toString(),
            }))
        }))
    } : {
        date: new Date().toISOString().split('T')[0],
        note: '',
        exercises: [{ exerciseId: '', sets: [{ reps: '', weight: '' }] }],
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#252525' }}}>
            <Formik
                initialValues={defaultInitialValues}
                validationSchema={workoutSessionValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const action = isEditMode
                        ? updateWorkoutSession(initialValues.id, values)
                        : saveWorkoutSession(values);
                    action
                        .then(() => {
                            setSubmitting(false);
                            onWorkoutAdded();
                            onClose();
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
                            <DialogTitle>{isEditMode ? 'Edytuj sesję treningową' : 'Nowa sesja treningowa'}</DialogTitle>
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
                                            filter: 'invert(1)',
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
                                            <ExerciseFieldForm
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

export default WorkoutSessionDialog;

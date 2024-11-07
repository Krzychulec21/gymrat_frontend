import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from "@mui/material";
import { Formik, Form, Field, FieldArray } from "formik";
import { getAllExercises } from "../service/exerciseService";
import { createTrainingPlan, updateTrainingPlan } from "../service/trainingPlanService";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";

const TrainingPlanForm = ({ open, onClose, initialValues, isEditMode }) => {
    const [exerciseOptions, setExerciseOptions] = useState([]);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const exercises = await getAllExercises();
            setExerciseOptions(exercises);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Nazwa jest wymagana"),
        description: Yup.string(),
        exercises: Yup.array()
            .of(
                Yup.object().shape({
                    exerciseId: Yup.number().required("Wybierz ćwiczenie"),
                    customInstructions: Yup.string(),
                })
            )
            .min(1, "Dodaj przynajmniej jedno ćwiczenie"),
    });

    const defaultValues = initialValues
        ? {
            name: initialValues.name,
            description: initialValues.description,
            exercises: initialValues.exercises.map((ex) => ({
                exerciseId: ex.id,
                customInstructions: ex.customInstructions,
            })),
        }
        : {
            name: "",
            description: "",
            exercises: [{ exerciseId: "", customInstructions: "" }],
        };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditMode ? "Edytuj plan treningowy" : "Nowy plan treningowy"}</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={defaultValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            if (isEditMode) {
                                await updateTrainingPlan(initialValues.id, values);
                            } else {
                                await createTrainingPlan(values);
                            }
                            onClose();
                        } catch (error) {
                            console.error("Error saving training plan:", error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, isSubmitting, setFieldValue }) => (
                        <Form>
                            <Field
                                name="name"
                                as={TextField}
                                label="Nazwa"
                                fullWidth
                                margin="normal"
                            />
                            <Field
                                name="description"
                                as={TextField}
                                label="Opis"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <FieldArray name="exercises">
                                {({ push, remove }) => (
                                    <>
                                        {values.exercises.map((exercise, index) => (
                                            <div key={index}>
                                                <Field name={`exercises[${index}].exerciseId`}>
                                                    {({ field }) => (
                                                        <Autocomplete
                                                            options={exerciseOptions}
                                                            getOptionLabel={(option) => option.name}
                                                            value={
                                                                exerciseOptions.find((option) => option.id === field.value) || null
                                                            }
                                                            onChange={(event, value) =>
                                                                setFieldValue(field.name, value ? value.id : "")
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Wybierz ćwiczenie"
                                                                    margin="normal"
                                                                />
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                                <Field
                                                    name={`exercises[${index}].customInstructions`}
                                                    as={TextField}
                                                    label="Instrukcje"
                                                    fullWidth
                                                    margin="normal"
                                                />
                                                <Button onClick={() => remove(index)} disabled={values.exercises.length === 1}>
                                                    Usuń ćwiczenie
                                                </Button>
                                            </div>
                                        ))}
                                        <Button onClick={() => push({ exerciseId: "", customInstructions: "" })}>
                                            Dodaj ćwiczenie
                                        </Button>
                                    </>
                                )}
                            </FieldArray>
                            <DialogActions>
                                <Button onClick={onClose}>Anuluj</Button>
                                <Button type="submit" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? "Zapisywanie..." : "Zapisz"}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default TrainingPlanForm;

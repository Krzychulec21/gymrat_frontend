import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@mui/material";
import {Field, FieldArray, Form, Formik} from "formik";
import {getAllExercises} from "../../service/exerciseService";
import {createTrainingPlan, updateTrainingPlan} from "../../service/trainingPlanService";
import Autocomplete from "@mui/material/Autocomplete";
import {getExerciseInfo} from "../../service/workoutService";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AboutExerciseDialog from "../workout/AboutExerciseDialog";
import {useSnackbar} from "../../context/SnackbarContext";


const TrainingPlanForm = ({open, onClose, initialValues, isEditMode, validationSchema, onUpdate}) => {
    const {showSnackbar} = useSnackbar();
    const [exerciseOptions, setExerciseOptions] = useState([]);
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

    const handleOpenDescription = async (exerciseId) => {
        try {
            const data = await getExerciseInfo(exerciseId);
            setExerciseInfo(data);
            setDialogOpen(true);
        } catch (error) {
            console.error("Błąd podczas pobierania informacji o ćwiczeniu:", error);
        }
    };


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
            exercises: [{exerciseId: "", customInstructions: ""}],
        };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>{isEditMode ? "Edytuj plan treningowy" : "Nowy plan treningowy"}</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={defaultValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values, {setSubmitting}) => {
                            try {
                                if (isEditMode) {
                                    await updateTrainingPlan(initialValues.id, values);
                                    showSnackbar("Plan treningowy został pomyślnie zaktualizowany!", "success");
                                } else {
                                    await createTrainingPlan(values);
                                    onUpdate();
                                    showSnackbar("Plan treningowy został pomyślnie utworzony!", "success");
                                }

                                onClose();
                            } catch (error) {
                                showSnackbar("Wystąpił błąd podczas zapisywania planu!", "error");
                                console.error("Error saving training plan:", error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({values, isSubmitting, setFieldValue, errors, touched}) => (
                            <Form>
                                <Field name="name">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="Nazwa"
                                            fullWidth
                                            margin="normal"
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    )}
                                </Field>
                                <Field name="description">
                                    {({field}) => (
                                        <TextField
                                            {...field}
                                            label="Opis"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={3}
                                            error={touched.description && Boolean(errors.description)}
                                            helperText={touched.description && errors.description}
                                        />
                                    )}
                                </Field>
                                <FieldArray name="exercises">
                                    {({push, remove}) => (
                                        <>
                                            {values.exercises.map((exercise, index) => (
                                                <div key={index}>
                                                    <Field name={`exercises[${index}].exerciseId`}>
                                                        {({field, form}) => (
                                                            <Autocomplete
                                                                options={exerciseOptions}
                                                                getOptionLabel={(option) => option.name}
                                                                groupBy={(option) => categoryMapping[option.categoryName] || option.categoryName}
                                                                value={
                                                                    exerciseOptions.find((option) => option.id === field.value) || null
                                                                }
                                                                onChange={(event, value) =>
                                                                    setFieldValue(field.name, value ? value.id : "")
                                                                }
                                                                noOptionsText={
                                                                    <span
                                                                        style={{color: 'white'}}>Brak ćwiczenia</span>}
                                                                renderOption={(props, option) => (
                                                                    <li key={option.id} {...props}
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center'
                                                                        }}>
                                                                        <span>{option.name}</span>
                                                                        <Tooltip title="Informacje o ćwiczeniu"
                                                                                 placement="top">
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
                                                                        error={form.touched.exercises?.[index]?.exerciseId && Boolean(form.errors.exercises?.[index]?.exerciseId)}
                                                                        helperText={form.touched.exercises?.[index]?.exerciseId && form.errors.exercises?.[index]?.exerciseId}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`exercises[${index}].customInstructions`}>
                                                        {({field, meta}) => (
                                                            <TextField
                                                                {...field}
                                                                label="Instrukcje"
                                                                fullWidth
                                                                margin="normal"
                                                                error={meta.touched && Boolean(meta.error)}
                                                                helperText={meta.touched && meta.error}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Button onClick={() => remove(index)}
                                                            disabled={values.exercises.length === 1}>
                                                        Usuń ćwiczenie
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button sx={{
                                                mt: 1
                                            }}
                                                    onClick={() => push({exerciseId: "", customInstructions: ""})}>
                                                Dodaj ćwiczenie
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                                <DialogActions>
                                    <Button onClick={() => {
                                        onClose();
                                    }}>Anuluj</Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                                        {isSubmitting ? "Zapisywanie..." : "Zapisz"}
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
                <AboutExerciseDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    exerciseInfo={exerciseInfo}
                />
            </Dialog>
        </>
    );
};

export default TrainingPlanForm;

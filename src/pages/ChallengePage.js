import React, {useEffect, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import UserMedals from "../components/challenge/UserMedals";
import RankingTable from "../components/challenge/RankingTable";
import ActiveChallenges from "../components/challenge/ActiveChallenges";
import AvailableChallengesTable from "../components/challenge/AvailableChallengesTable";
import ChallengeHistoryTable from "../components/challenge/ChallengeHistoryTable";
import {useFormik} from "formik";
import * as Yup from "yup";
import {createChallenge, getAllChallengeTypes} from "../service/challengeService";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useSnackbar} from "../context/SnackbarContext";
import {getAllExercises} from "../service/workoutService";
import Autocomplete from "@mui/material/Autocomplete";
import {useMediaQuery} from "@mui/system";

export default function ChallengePage() {
    const [open, setOpen] = useState(false);
    const {showSnackbar} = useSnackbar();
    const [challengeTypes, setChallengeTypes] = useState([]);
    const [exercises, setExercises] = useState([]);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));


    useEffect(() => {
        async function fetchData() {
            try {
                const types = await getAllChallengeTypes();
                const exercisesData = await getAllExercises();
                setChallengeTypes(types);
                setExercises(exercisesData);
            } catch (error) {
                showSnackbar("Błąd podczas ładowania danych!", "error");
            }
        }

        fetchData();
    }, []);


    const formik = useFormik({
        initialValues: {
            name: "",
            typeId: "",
            endDate: "",
            isPublic: true,
            exerciseId: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Nazwa jest wymagana"),
            typeId: Yup.number().required("Wybierz typ wyzwania"),
            endDate: Yup.date().required("Data zakończenia jest wymagana"),
            isPublic: Yup.boolean(),
            exerciseId: Yup.lazy((typeId) => {
                return typeId !== 1
                    ? Yup.number().required("Wybierz ćwiczenie dla tego typu wyzwania")
                    : Yup.number().nullable();
            }),
        }),
        onSubmit: async (values, {setSubmitting, resetForm}) => {
            try {
                await createChallenge(values);
                showSnackbar("Wyzwanie zostało utworzone!", "success");
                setOpen(false);
                resetForm();
            } catch (error) {
                showSnackbar("Wystąpił błąd podczas tworzenia wyzwania!", "error");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box sx={{p: 2,}}>
            <Box sx={{display: "flex", justifyContent: "flex-end", mb: 5}}>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                    Dodaj wyzwanie
                </Button>
            </Box>
            <UserMedals/>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    my: 2,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                    flexDirection: isMobile ? "column" : "row",
                    width: "100%",
                }}
            >
                <Box sx={{width: isMobile ? "100%" : "50%"}}>
                    <RankingTable title="Ranking globalny" isGlobal/>
                </Box>
                <Box sx={{width: isMobile ? "100%" : "50%"}}>
                    <RankingTable title="Ranking znajomych" isGlobal={false}/>
                </Box>
            </Box>


            <Box sx={{my: 2}}>
                <Typography variant="h4" sx={{textAlign: 'center'}}>Twoje wyzwania</Typography>
                <ActiveChallenges/>
            </Box>

            <AvailableChallengesTable/>
            <ChallengeHistoryTable/>


            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Utwórz Wyzwanie</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="name"
                            label="Nazwa"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="endDate"
                            label="Data zakończenia"
                            type="date"
                            InputLabelProps={{shrink: true}}
                            value={formik.values.endDate}
                            onChange={formik.handleChange}
                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formik.values.isPublic}
                                    onChange={formik.handleChange}
                                    name="isPublic"
                                />
                            }
                            label="Publiczne?"
                        />
                        <Autocomplete
                            options={challengeTypes}
                            getOptionLabel={(option) => option.name}
                            value={challengeTypes.find((option) => option.id === formik.values.typeId) || null}
                            onChange={(event, value) => formik.setFieldValue("typeId", value ? value.id : "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Typ wyzwania"
                                    margin="normal"
                                    error={formik.touched.typeId && Boolean(formik.errors.typeId)}
                                    helperText={formik.touched.typeId && formik.errors.typeId}
                                />
                            )}
                        />

                        <Autocomplete
                            options={exercises}
                            getOptionLabel={(option) => option.name}
                            value={exercises.find((option) => option.id === formik.values.exerciseId) || null}
                            onChange={(event, value) => formik.setFieldValue("exerciseId", value ? value.id : "")}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Wybierz ćwiczenie (jeśli wymagane)"
                                    margin="normal"
                                    error={formik.touched.exerciseId && Boolean(formik.errors.exerciseId)}
                                    helperText={formik.touched.exerciseId && formik.errors.exerciseId}
                                />
                            )}
                        />
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Anuluj</Button>
                            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? "Zapisywanie..." : "Zapisz"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

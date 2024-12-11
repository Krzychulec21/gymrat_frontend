import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDropzone } from 'react-dropzone';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Box } from '@mui/material';
import * as Yup from 'yup';
import { addPost } from "../../service/postService";
import {useSnackbar} from "../../context/SnackbarContext";

const postValidationSchema = Yup.object().shape({
    description: Yup.string()
        .required('Opis jest wymagany')
        .max(500, 'Opis nie może przekraczać 500 znaków'),
    photo: Yup.mixed().notRequired(),
});

const PostDialog = ({ open, onClose, onPostAdded, workoutId }) => {
    const {showSnackbar} = useSnackbar();
    const onDrop = (acceptedFiles, setFieldValue) => {
        if (acceptedFiles.length > 0) {
            setFieldValue('photo', acceptedFiles[0]);
        }
    };

    const Dropzone = ({ setFieldValue, values }) => {
        const { getRootProps, getInputProps } = useDropzone({
            onDrop: (files) => onDrop(files, setFieldValue),
            accept: 'image/*',
            multiple: false,
        });

        return (
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed #aaa',
                    padding: '16px',
                    textAlign: 'center',
                    marginTop: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                }}
            >
                <input {...getInputProps()} accept="image/*"/>
                {values.photo ? (
                    <Typography variant="body1" color="white">
                        {values.photo.name}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="white">
                        Przeciągnij i upuść zdjęcie tutaj lub kliknij, aby wybrać plik
                    </Typography>
                )}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor: '#252525' } }}>
            <Formik
                initialValues={{ description: '', photo: null }}
                validationSchema={postValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await addPost(workoutId, values.description, values.photo);
                        setSubmitting(false);
                        onPostAdded();
                        showSnackbar("Post został pomyślnie dodany!");
                        onClose();
                    } catch (error) {
                        console.error('Failed to add post:', error);
                        showSnackbar("Wystąpił błąd podczas dodawania postu!", 'error');
                        setSubmitting(false);
                    }
                }}
            >
                {({ setFieldValue, values, isSubmitting, errors, touched }) => (
                    <Form>
                        <DialogTitle>Chcesz pochwalić się swoim treningiem?</DialogTitle>
                        <DialogContent>
                            <Field
                                name="description"
                                as={TextField}
                                label="Opis"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                InputProps={{ style: { color: 'white' } }}
                                error={touched.description && Boolean(errors.description)}
                                helperText={<ErrorMessage name="description" />}
                            />

                            <Typography variant="subtitle1" style={{ color: 'white', margin: '16px 0' }}>
                                Dodaj zdjęcie (opcjonalnie)
                            </Typography>
                            <Dropzone setFieldValue={setFieldValue} values={values} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} variant="secondAction">Nie tym razem</Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Dodaj post
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default PostDialog;

import React, { useEffect, useState } from "react";
import { Box, Button, TablePagination, TextField, Typography } from "@mui/material";
import { addComment, getComments } from "../../service/trainingPlanService";
import dayjs from "dayjs";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const CommentsSection = ({ trainingPlanId }) => {
    const { t } = useTranslation("trainingPlansPage");
    const [comments, setComments] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(5);

    useEffect(() => {
        fetchComments();
    }, [page]);

    const fetchComments = async () => {
        try {
            const params = {
                page,
                size,
                sortField: "dateCreated",
                sortDirection: "desc",
            };
            const data = await getComments(trainingPlanId, params);
            setComments(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleAddComment = async (values, { resetForm }) => {
        try {
            await addComment(trainingPlanId, values.content);
            resetForm();
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const validationSchema = Yup.object({
        content: Yup.string()
            .max(500, t("commentsSection.validation.commentMax"))
            .required(t("commentsSection.validation.commentRequired")),
    });

    return (
        <Box sx={{ marginTop: "20px" }}>
            <Box sx={{ borderBottom: "2px solid white", marginY: "20px" }} />
            <Typography variant="h6">{t("commentsSection.title")}</Typography>
            {comments.map((comment) => (
                <Box
                    key={comment.id}
                    sx={{
                        marginBottom: "10px",
                        backgroundColor: "#363636",
                        borderRadius: "8px",
                        padding: "2px",
                        maxWidth: { xs: "100%", lg: "100%" },
                    }}
                >
                    <Typography variant="subtitle1">
                        {comment.authorNickname} - {dayjs(comment.dateCreated).format("DD.MM.YYYY HH:mm")}
                    </Typography>
                    <Typography variant="body2">{comment.content}</Typography>
                </Box>
            ))}
            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                rowsPerPageOptions={[5]}
            />
            <Formik
                initialValues={{ content: "" }}
                validationSchema={validationSchema}
                onSubmit={handleAddComment}
                validateOnBlur={false}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Field
                            as={TextField}
                            name="content"
                            label={t("commentsSection.field.addComment")}
                            fullWidth
                            multiline
                            rows={3}
                            error={touched.content && Boolean(errors.content)}
                            helperText={touched.content && errors.content}
                            sx={{ marginTop: "10px" }}
                        />
                        <Button type="submit" disabled={isSubmitting} sx={{ marginTop: "10px" }}>
                            {t("commentsSection.button.submitComment")}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CommentsSection;

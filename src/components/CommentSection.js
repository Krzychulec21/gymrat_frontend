import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    TablePagination,

} from "@mui/material";
import { getComments, addComment } from "../service/trainingPlanService";
import dayjs from "dayjs";

const CommentsSection = ({ trainingPlanId }) => {
    const [comments, setComments] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [content, setContent] = useState("");

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

    const handleAddComment = async () => {
        try {
            await addComment(trainingPlanId, content);
            setContent("");
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Box sx={{ marginTop: "20px" }}>
            <Typography variant="h6">Komentarze</Typography>
            {comments.map((comment) => (
                <Box key={comment.id} sx={{ marginBottom: "10px" }}>
                    <Typography variant="subtitle2">
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
            <TextField
                label="Dodaj komentarz"
                fullWidth
                multiline
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ marginTop: "10px" }}
            />
            <Button onClick={handleAddComment} sx={{ marginTop: "10px" }}>
                Dodaj komentarz
            </Button>
        </Box>
    );
};

export default CommentsSection;

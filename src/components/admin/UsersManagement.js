import {useEffect, useState} from "react";
import {useSnackbar} from "../../context/SnackbarContext";
import {blockUser, getAllUsers, warnUser} from "../../service/userService";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';
import TextField from "@mui/material/TextField";
import {Formik} from "formik";

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const {showSnackbar} = useSnackbar();
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(8);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("lastName");
    const [totalElements, setTotalElements] = useState(0);

    const [openWarningDialog, setOpenWarningDialog] = useState(false);
    const [openBlockDialog, setOpenBlockDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [warningMessage, setWarningMessage] = useState("");


    const fetchUsers = async () => {
        try {
            const data = await getAllUsers(page, rowsPerPage, orderBy, order);
            setUsers(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            showSnackbar("Wystąpił błąd podczas pobierania użytkowników", "error");
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page, order, orderBy]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleOpenWarningDialog = (user) => {
        setSelectedUser(user);
        setOpenWarningDialog(true);
    };

    const handleOpenBlockDialog = (user) => {
        setSelectedUser(user);
        setOpenBlockDialog(true);
    };

    const handleCloseDialogs = () => {
        setOpenWarningDialog(false);
        setOpenBlockDialog(false);
        setWarningMessage("");
        setSelectedUser(null);
    };

    const handleSendWarning = async (values, {resetForm}) => {
        try {
            await warnUser(selectedUser.id, values);
            showSnackbar(`Wysłano ostrzeżenie do użytkownika ${selectedUser.nickname}`, "success");
        } catch (error) {
            showSnackbar(`Wystąpił nieoczekiwany błąd`, "error");
        }
        resetForm();
        handleCloseDialogs();
    };

    const handleBlockUser = async () => {
        try {
            await blockUser(selectedUser.id);
            showSnackbar(`Zablokowano użytkownika ${selectedUser.nickname}`, "success");
        } catch (error) {
            showSnackbar(`Wystąpił nieoczekiwany błąd`, "error");
        }
        handleCloseDialogs();
    };
    const validationSchema = Yup.object({
        warningMessage: Yup.string()
            .required("Opis jest wymagany")
            .min(5, "Opis musi mieć co najmniej 5 znaków")
    });


    return (
        <Box
            sx={{
                padding: "20px",
                backgroundColor: "#2C2C2C",
                borderRadius: "8px",
                color: "white",
                width: "100%",
                minWidth: {md: "650px"},
                maxWidth: "100%",
                margin: "auto",
                overflowX: "hidden",
            }}
        >
            <Typography variant="h4" sx={{mb: 2, textAlign: 'center'}}>
                Zarządzanie użytkownikami
            </Typography>

            <TableContainer
                component={Box}
                sx={{
                    overflowX: 'auto',
                    width: '100%',
                    maxWidth: '100%'
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                onClick={(event) => handleRequestSort(event, "lastName")}
                                style={{cursor: 'pointer'}}
                            >
                                Nazwisko {orderBy === 'lastName' && (order === 'asc' ? '⬆' : '⬇')}
                            </TableCell>
                            <TableCell>Imię</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell
                                onClick={(event) => handleRequestSort(event, "nickname")}
                                style={{cursor: 'pointer'}}
                            >
                                Nazwa {orderBy === 'nickname' && (order === 'asc' ? '⬆' : '⬇')}
                            </TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenWarningDialog(user)}>
                                        <WarningIcon sx={{
                                            color: 'yellow'
                                        }}/>
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenBlockDialog(user)}>
                                        <BlockIcon sx={{
                                            color: 'red'
                                        }}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[8]}
                >
                </TablePagination>
            </TableContainer>

            <Dialog open={openWarningDialog} onClose={handleCloseDialogs}>
                <DialogTitle>Wyślij ostrzeżenie dla użytkownika</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{warningMessage: ""}}
                        validationSchema={validationSchema}
                        onSubmit={handleSendWarning}
                    >
                        {({handleSubmit, isSubmitting, values, handleChange, errors, touched}) => (
                            <>
                                <TextField
                                    fullWidth
                                    name="warningMessage"
                                    label="Opis"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={values.warningMessage}
                                    onChange={handleChange}
                                    error={touched.warningMessage && Boolean(errors.warningMessage)}
                                    helperText={touched.warningMessage && errors.warningMessage}
                                    sx={{mt: 2}}
                                />
                                <DialogActions>
                                    <Button onClick={handleCloseDialogs} color="secondary">Anuluj</Button>
                                    <Button
                                        onClick={handleSubmit}
                                        color="primary"
                                        disabled={isSubmitting}
                                    >
                                        Wyślij
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>


            <Dialog open={openBlockDialog} onClose={handleCloseDialogs}>
                <DialogTitle>Czy na pewno chcesz zablokować użytkownika?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Czy jesteś pewien, że chcesz zablokować użytkownika <b>{selectedUser?.nickname}</b>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs} color="secondary">Anuluj</Button>
                    <Button onClick={handleBlockUser} color="error">Potwierdź</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );


}

export default UsersManagement;
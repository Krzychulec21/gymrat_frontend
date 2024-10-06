import React, {useState} from 'react';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    List,
    MenuItem,
    Pagination,
    Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import UserListItem from "./UserListItem";

const FriendsList = ({
                         friends,
                         onRemoveFriend,
                         onChatStart,
                         currentPage,
                         setCurrentPage,
                         totalPages,
                         setSortBy,
                         setSortDir,
                         sortBy,
                         sortDir
                     }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const menuProps = {
        PaperProps: {
            style: {
                backgroundColor: 'grey',
                color: 'black',
            },
        },
    };

    const handleDeleteClick = (friend) => {
        setSelectedFriend(friend);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFriend(null);
    };

    const handleConfirmDelete = () => {
        if (selectedFriend) {
            onRemoveFriend(selectedFriend.email);
        }
        handleCloseDialog();
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value - 1);
    };

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2}}>
                <FormControl size="small">
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        MenuProps={menuProps}
                        sx={{
                            backgroundColor: 'grey',
                            color: 'black',
                            '.MuiSelect-icon': {
                                color: 'black',
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'grey',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'grey',
                            },
                            '.MuiSelect-select': {
                                color: 'black',
                            }
                        }}
                    >
                        <MenuItem value="firstName">Imię</MenuItem>
                        <MenuItem value="lastName">Nazwisko</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <Select
                        value={sortDir}
                        onChange={(e) => setSortDir(e.target.value)}
                        sx={{
                            backgroundColor: 'grey',
                            color: 'black',
                            '.MuiSelect-icon': {
                                color: 'black',
                            },
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'grey',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'grey',
                            },
                            '.MuiSelect-select': {
                                color: 'black',
                            }
                        }}
                        MenuProps={menuProps}
                    >
                        <MenuItem value="asc">Rosnąco</MenuItem>
                        <MenuItem value="desc">Malejąco</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '80vh'}}>
                <Box
                    sx={{
                        overflowY: "auto",
                        height: "100%",
                        '&::-webkit-scrollbar': {
                            width: '8px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,.1)',
                            outline: '1px solid white',
                            borderRadius: '10px'
                        }
                    }}
                >
                    <List>
                        {friends.map((friend) => (
                            <UserListItem
                                key={friend.id}
                                user={friend}
                                primaryActionIcon={<Button size="small">Chat</Button>}
                                secondaryActionIcon={<DeleteIcon sx={{color: 'red'}}/>}
                                onPrimaryAction={() => onChatStart(friend.id, friend.firstName, friend.lastName)}
                                onSecondaryAction={() => handleDeleteClick(friend)}
                            />
                        ))}
                    </List>
                </Box>

                <Pagination
                    count={totalPages}
                    page={currentPage + 1}
                    onChange={handlePageChange}
                    sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        "& .MuiPaginationItem-root": {
                            color: 'white',
                        },
                        "& .Mui-selected": {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            color: 'black'
                        },
                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        }
                    }}
                />
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć{' '}
                        {selectedFriend ? `${selectedFriend.firstName} ${selectedFriend.lastName}` : ''} z listy
                        znajomych?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FriendsList;

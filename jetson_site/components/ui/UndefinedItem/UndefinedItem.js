import React, { useState } from 'react'
import { Avatar, Backdrop, Collapse, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, TextField } from "@material-ui/core"
import { ExpandLess, ExpandMore, Add, Delete } from '@material-ui/icons'

function SimpleDialog({ onClose, selectedValue, open }) {

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Create user</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Add credits
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Credits"
                    fullWidth
                    onChange={(e) => handleListItemClick(e.target.value)}
                />
            </DialogContent>
            <List>
                <ListItem autoFocus button  >
                    <ListItemAvatar>
                        <Avatar>
                            <Add />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Add account" />
                </ListItem>
            </List>
        </Dialog>
    );
}

const UndefinedItem = () => {
    const [open, setOpen] = React.useState(false);
    const [formValue, setFormValue] = React.useState('Undefined user');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setFormValue(value);
    };
    return (
        <>
            <ListItem button>
                <ListItemAvatar>
                    <Avatar
                    // alt={`Avatar n°`}
                    // src={`/static/images/avatar/.jpg`}
                    />
                </ListItemAvatar>
                <ListItemAvatar>
                    <Avatar
                    // alt={`Avatar n°`}
                    // src={`/static/images/avatar/.jpg`}
                    />
                </ListItemAvatar>
                <ListItemText primary={formValue} />

                <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={handleClickOpen}>
                        <Add />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <SimpleDialog selectedValue={formValue} open={open} onClose={handleClose} />
        </>
    )
}

export default UndefinedItem
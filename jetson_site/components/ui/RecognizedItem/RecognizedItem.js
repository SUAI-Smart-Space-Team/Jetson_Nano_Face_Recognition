import React, { useState } from 'react'
import { Avatar, Collapse, Dialog, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core"
import { ExpandLess, ExpandMore, Add, Delete, Edit, Save } from '@material-ui/icons'
import { mutate } from 'swr'
import { useRouter } from 'next/router'

const contentType = 'application/json'

const RecognizedItem = ({ user }) => {
    const [modal, setModal] = useState(false)

    const [open, setOpen] = useState({ open: false, src: '' })

    const [edit, setEdit] = useState(false)

    const [name, setName] = useState(user.name)

    const router = useRouter()

    const handleClick = () => {
        setModal(!modal);
    }

    const handleDeleteUser = async () => {
        await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                _id: user._id
            }),
        })
        mutate('/api/users')
        router.push('/dashboard')
    }

    const handleEdit = async () => {
        setEdit(!edit)
        if (edit) {
            await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    Accept: contentType,
                    'Content-Type': contentType,
                },
                body: JSON.stringify({
                    name,
                    id: user._id
                }),
            })
        }
        mutate('/api/users')
        router.push('/dashboard')
    }


    const handleInputChange = (e) => {
        setName(e.target.value);
    }

    const avatar = user.images.find((image) => !image.croped)

    return (
        <>
            <ListItem button>
                <ListItemIcon>

                    <IconButton edge="end" onClick={handleEdit}>
                        {edit ? <Save /> : <Edit />}
                    </IconButton>
                </ListItemIcon>
                <ListItemAvatar key={avatar._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                    <Avatar
                        src={avatar.url}
                    />
                </ListItemAvatar>

                {edit ? <InputBase
                    fullWidth
                    value={name}
                    onChange={handleInputChange}
                /> :
                    <ListItemText primary={user.name} />}
                {/* <ListItemText primary={new Date(user.date).toLocaleString()} /> */}
                <ListItemIcon onClick={handleClick}>
                    {modal ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>

                <ListItemSecondaryAction>
                    <IconButton onClick={handleDeleteUser}>
                        <Delete />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={modal} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button>
                        {user.images.map((image) => image.croped && (
                            <ListItemAvatar key={image._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                                <Avatar
                                    src={image.url}
                                />
                            </ListItemAvatar>
                        ))}
                    </ListItem>
                    <ListItemSecondaryAction>
                        <IconButton edge="end">
                            <Add />
                        </IconButton>
                    </ListItemSecondaryAction>
                </List>
            </Collapse>
            <Dialog open={open.open} onClose={() => setOpen((state) => ({ ...state, open: false }))}>
                <img src={open.src} />
            </Dialog>
        </>
    )
}

export default RecognizedItem
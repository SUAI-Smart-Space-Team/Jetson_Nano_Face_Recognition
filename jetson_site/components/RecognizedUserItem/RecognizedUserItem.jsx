import React, { useState } from 'react'
import { Avatar, Badge, Collapse, Dialog, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core"
import { ExpandLess, ExpandMore, Add, Delete, Edit, Save, Clear } from '@material-ui/icons'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import { DropzoneDialog } from 'material-ui-dropzone'

const contentType = 'application/json'

const RecognizedUserItem = ({ user }) => {
    const [modal, setModal] = useState(false)

    const [open, setOpen] = useState({ open: false, src: '' })

    const [dropzone, setDropzone] = useState(false)

    const [edit, setEdit] = useState(false)

    const [name, setName] = useState(user.name)

    const router = useRouter()

    const handleClick = () => {
        setModal(!modal);
    }

    const inputChangeHandler = (e) => {
        setName(e.target.value);
    }

    const deleteUserHandler = async () => {
        await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                _id: user._id,
                imageId: null
            }),
        })
        mutate('/api/users')
        router.push('/dashboard')
    }

    const editUserNameHandler = async () => {
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

    const deleteImageHandler = async (e, imageId) => {
        console.log(imageId)
        await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                _id: user._id,
                imageId: imageId
            }),
        })
        mutate('/api/users')
        router.push('/dashboard')
    }

    const addNewImageHandler = async (files) => {
        const form = new FormData();
        console.log(files)
        files.forEach((file) => form.append("media", file));

        const data = await fetch('/api/upload', {
            method: 'POST',
            body: form
        })

        if (data.ok) {
            await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    Accept: contentType,
                    'Content-Type': contentType,
                },
                body: JSON.stringify({
                    name: user.name,
                    images: files
                }),
            })
        }

        console.log(data)
        mutate('/api/users')
        router.push('/dashboard')
        setDropzone(false)
    }

    const avatar = user.images.find((image) => !image.croped)

    return (
        <>
            <ListItem button>
                <ListItemIcon>

                    <IconButton edge="end" onClick={editUserNameHandler}>
                        {edit ? <Save /> : <Edit />}
                    </IconButton>
                </ListItemIcon>
                <ListItemAvatar key={avatar?._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                    <Avatar
                        src={avatar?.url}
                    />
                </ListItemAvatar>

                {edit ? <InputBase
                    fullWidth
                    value={name}
                    onChange={inputChangeHandler}
                /> :
                    <ListItemText primary={user.name} />}

                <ListItemIcon onClick={handleClick}>
                    {modal ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>

                <ListItemSecondaryAction>
                    <IconButton onClick={deleteUserHandler}>
                        <Delete />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={modal} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button style={{ minHeight: 64 }}>
                        {user.images.map((image) => image.croped && (
                            <ListItemAvatar key={image._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                                <Badge
                                    badgeContent={
                                        <IconButton onClick={(e) => deleteImageHandler(e, image._id)} aria-label="delete" size="small">
                                            <Clear fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    <Avatar
                                        src={image.url}
                                    />
                                </Badge>

                            </ListItemAvatar>
                        ))}
                    </ListItem>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => setDropzone(true)}>
                            <Add />
                        </IconButton>
                    </ListItemSecondaryAction>
                </List>
            </Collapse>
            <Dialog open={open.open} onClose={() => setOpen((state) => ({ ...state, open: false }))}>
                <img src={open.src} />
            </Dialog>
            <DropzoneDialog
                acceptedFiles={['image/*']}
                cancelButtonText={"cancel"}
                submitButtonText={"save"}
                maxFileSize={5000000}
                open={dropzone}
                onClose={() => setDropzone(false)}
                onSave={addNewImageHandler}
                showPreviews={false}
                showPreviewsInDropzone
            />
        </>
    )
}

export default RecognizedUserItem
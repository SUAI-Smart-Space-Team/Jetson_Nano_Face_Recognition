import React, { useState } from 'react'
import { IconButton, ListItem, ListItemIcon, ListItemText, TextField, Typography } from "@material-ui/core"
import { Add, Close } from "@material-ui/icons"
import { DropzoneDialogBase } from 'material-ui-dropzone'
import { mutate } from 'swr'
import { useRouter } from 'next/router'

const contentType = 'application/json'

const AddNewUserItem = () => {

    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [fileObjects, setFileObjects] = useState([])
    const router = useRouter()
    const createNewUserHandler = async () => {

        const form = new FormData()
        const files = fileObjects.map((item) => item.file)

        files.forEach((file) => form.append("media", file));
        console.log(files)
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
                    name,
                    images: files
                }),
            })
        }


        mutate('/api/users')
        router.push('/dashboard')
        setOpen(false)
    }

    const inputChangeHandler = (e) => {
        setName(e.target.value);
    }
    console.log(name)
    return (
        <>
            <ListItem button alignItems="center" onClick={() => setOpen(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                <ListItemText primary={'Add new user'} />
            </ListItem>
            <DropzoneDialogBase
                dialogTitle={
                    <>
                        <Typography component={'span'} variant="h6">Enter name</Typography>
                        <TextField fullWidth onChange={inputChangeHandler} />
                        <IconButton
                            style={{ right: '12px', top: '8px', position: 'absolute' }}
                            onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    </>
                }
                acceptedFiles={['image/*']}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"save"}
                maxFileSize={5000000}
                open={open}
                onAdd={newFileObjs => {
                    console.log('onAdd', newFileObjs)
                    setFileObjects([].concat(fileObjects, newFileObjs))
                }}
                onDelete={(deleteFileObj, idx) => {
                    console.log('onDelete', deleteFileObj, idx)
                    const remainingFileObjs = fileObjects.filter((fileObject, i) => {
                        return i !== idx;
                    })
                    setFileObjects(remainingFileObjs)
                }}
                onClose={() => setOpen(false)}
                onSave={createNewUserHandler}
                showPreviews={false}
                showPreviewsInDropzone
            />
        </>
    )
}

export default AddNewUserItem
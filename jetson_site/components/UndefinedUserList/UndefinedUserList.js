import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, Dialog, IconButton, InputBase, LinearProgress, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField, Typography } from "@material-ui/core"
import { Add } from '@material-ui/icons'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/router'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const contentType = 'application/json'

const UndefinedUserList = () => {
    const { data: images, error } = useSWR('/api/images', fetcher, { refreshInterval: 1000 })

    if (!images) return <LinearProgress color="secondary" />

    const groups = images.reduce((group, key, index) => {
        return (index % 2 == 0 ? group.push([key])
            : group[group.length - 1].push(key)) && group

    }, [])

    return (
        <List>
            {groups.length > 0 ?
                groups.map((group, i) => (
                    <ListItem button key={i}>
                        <InnerListItem group={group} />
                    </ListItem>
                ))
                : <Typography variant="caption" display="block" align="center">No undefined users found</Typography>
            }
        </List >
    )
}

const InnerListItem = ({ group }) => {
    const [name, setName] = useState('')
    const [open, setOpen] = useState({ open: false, src: '' })
    const router = useRouter()
    const handleInputChange = (e) => {
        setName(e.target.value);
    }

    const handleCreateUser = async () => {
        await fetch('/api/users', {
            method: 'POST',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                name: name || `User - ${Math.floor(Math.random() * 100000)}`,
                images: [group[0]._id, group[1]._id]
            }),
        })

        mutate('/api/images')
        router.push('/dashboard')
        setName('')
    }

    return (
        <>
            {group.sort((x) => x.croped ? 0 : x ? -1 : 1).map((image) => (
                <ListItemAvatar key={image._id} onClick={(e) => e.target.src && setOpen({ open: true, src: e.target.src })}>
                    <Avatar
                        src={image.url}
                    />
                </ListItemAvatar>
            ))}
            <InputBase
                style={{ width: 400 }}
                placeholder="Undefined User"
                value={name}
                onChange={handleInputChange}
            />
            <ListItemText
                primary={new Date(group[0].date).toLocaleString()}
            />
            <ListItemSecondaryAction>
                <IconButton onClick={handleCreateUser}>
                    <Add />
                </IconButton>
            </ListItemSecondaryAction>
            <Dialog open={open.open} onClose={() => setOpen((state) => ({ ...state, open: false }))}>
                <img src={open.src} />
            </Dialog>
        </>
    )
}

export default UndefinedUserList
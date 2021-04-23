import React from 'react'
import { LinearProgress, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core"
import useSWR, { mutate } from 'swr'
import UndefinedUserItem from '../UndefinedUserItem'
import { Restore } from '@material-ui/icons'
import { useRouter } from 'next/router'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const contentType = 'application/json'

const UndefinedUserList = () => {
    const { data: images, error } = useSWR('/api/images', fetcher, { refreshInterval: 1000 })

    const router = useRouter()

    if (!images) return <LinearProgress color="secondary" />

    const groups = images.reduce((group, key, index) => {
        return (index % 2 == 0 ? group.push([key])
            : group[group.length - 1].push(key)) && group
    }, [])

    const clearUsersHandler = async () => {
        if (groups.length === 0) return
        await fetch('/api/images', {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                images: null
            }),
        })
        mutate('/api/images')
        router.push('/dashboard')
    }

    return (
        <List>
            <ListItem button onClick={clearUsersHandler}>
                <ListItemIcon>
                    <Restore />
                </ListItemIcon>
                <ListItemText primary={'Clear undefined users'} />
            </ListItem>
            {groups.length > 0 ?
                groups.map((group, i) => (
                    <ListItem button key={i}>
                        <UndefinedUserItem group={group} />
                    </ListItem>
                ))
                : <Typography variant="caption" display="block" align="center">No undefined users found</Typography>
            }
        </List>
    )
}

export default UndefinedUserList
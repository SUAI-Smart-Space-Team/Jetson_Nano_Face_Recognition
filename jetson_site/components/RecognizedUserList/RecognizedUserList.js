import React, { useEffect, useMemo, useState } from 'react'
import { ListItemIcon, List, ListItem, ListItemText, LinearProgress, Typography } from "@material-ui/core"
import useSWR from 'swr'
import RecognizedItem from '../ui/RecognizedItem/RecognizedItem'
import { Add } from '@material-ui/icons'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const RecognizedUserList = () => {
    const { data: users, error } = useSWR('/api/users', fetcher)

    if (!users) return <LinearProgress color="secondary" />
    console.log(users)
    return (
        <List>
            <ListItem button alignItems="center">
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                <ListItemText primary={'Add new user'} />
            </ListItem>
            {users.length > 0 ?
                users.map(user => {
                    console.log(user)
                    return <RecognizedItem key={user._id} user={user} />
                })
                :
                <Typography variant="caption" display="block" align="center">No recognized users found</Typography>}
        </List>
    )
}

export default RecognizedUserList
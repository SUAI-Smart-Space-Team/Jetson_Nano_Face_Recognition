import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, IconButton, InputBase, LinearProgress, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, TextField, Typography } from "@material-ui/core"
import { Add, Clear, Restore } from '@material-ui/icons'
import useSWR, { mutate } from 'swr'
import { useRouter } from 'next/router'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const contentType = 'application/json'

const StatsUserList = () => {
    const { data: stats, error } = useSWR('/api/stats', fetcher, { refreshInterval: 1000 })

    const router = useRouter()

    if (!stats) return <LinearProgress color="secondary" />

    const clearHistoryHandler = async () => {
        await fetch('/api/stats', {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify({
                stats: null
            }),
        })
        mutate('/api/stats')
        router.push('/dashboard')
    }

    return (
        <List>
            <ListItem button onClick={clearHistoryHandler}>
                <ListItemIcon>
                    <Restore />
                </ListItemIcon>
                <ListItemText primary={'Clear history'} />
            </ListItem>
            {stats.length > 0 ? stats.map((stat, i) => (
                <ListItem button key={i}>
                    <ListItemText
                        primary={stat.name}
                    />
                    <ListItemText
                        primary={new Date(stat.date).toLocaleString()}
                    />
                </ListItem>
            )) : <Typography variant="caption" display="block" align="center">No history found</Typography>}
        </List >
    )
}

export default StatsUserList
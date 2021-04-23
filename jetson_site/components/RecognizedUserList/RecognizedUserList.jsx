import React from 'react'
import { List, LinearProgress, Typography } from "@material-ui/core"
import useSWR from 'swr'
import RecognizedUserItem from '../RecognizedUserItem'
import AddNewUserItem from '../AddNewUserItem'

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const RecognizedUserList = () => {
    const { data: users, error } = useSWR('/api/users', fetcher, { refreshInterval: 1000 })

    if (!users) return <LinearProgress color="secondary" />

    return (
        <List>
            <AddNewUserItem />
            {users.length > 0 ?
                users.map(user => {
                    return <RecognizedUserItem key={user._id} user={user} />
                })
                :
                <Typography variant="caption" display="block" align="center">No recognized users found</Typography>}
        </List>
    )
}

export default RecognizedUserList
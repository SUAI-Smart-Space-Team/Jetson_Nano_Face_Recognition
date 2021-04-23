import React, { useState } from 'react'
import { Button, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from "@material-ui/core"
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { useRouter } from 'next/router'

const contentType = 'application/json'

//login page

const Index = () => {
    const [values, setValues] = useState({
        login: '',
        password: '',
        showPassword: false,
    })

    const router = useRouter()

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    }

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        })
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    const handlePostLogin = async () => {
        // const res = await fetch('/api/login', {
        //     method: 'POST',
        //     headers: {
        //         Accept: contentType,
        //         'Content-Type': contentType,
        //     },
        //     body: JSON.stringify({
        //         values
        //     }),
        // })

        // console.log(res)
        router.push('/dashboard')

    }

    return (
        <Container maxWidth="xs" style={{ marginTop: 200 }}>
            <Grid container spacing={5}>
                <Grid container item xs={12} spacing={3}>
                    <Typography variant="h2" align="center">Login</Typography>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-login">Login</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-login"
                            type={'text'}
                            value={values.login}
                            onChange={handleChange('login')}
                            label="Login"
                        />
                    </FormControl>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Button variant="contained" color="secondary" onClick={handlePostLogin}>Login</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Index
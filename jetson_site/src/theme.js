import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

//create app theme 

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#6202EE',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
})

export default theme
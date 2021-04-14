function SimpleDialog(props) {
    const classes = useStyles();
    const { open, src, name } = props;

    return (
        <Dialog open={open}>
            <DialogTitle>{name}</DialogTitle>
        </Dialog>
    );
}
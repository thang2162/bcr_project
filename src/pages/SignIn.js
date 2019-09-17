import React, { useContext }  from 'react';
import { Context } from "../store";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Footer from "../Footer";
import PrimarySearchAppBar from "../PrimarySearchAppBar";
import LoadingOverlay from 'react-loading-overlay';
import { Link as RouterLink, withRouter } from 'react-router-dom';

const apiUrl = 'https://tonesseniorproject.com:3030/'


const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default withRouter(function SignIn(props) {
  const classes = useStyles();
  const { store, dispatch } = useContext(Context);

  const [isLoading, setIsLoading] = React.useState(false);

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    recoveryEmail: ''
  });

  const handleChange = name => event => {

    setValues({ ...values, [name]: event.target.value });

  };

  //Dialog functions - start
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }


    //Dialog functions - end

    const submitForm = () => {

      if(values.email == '' || values.password == '')
      {
        alert('Please fill out the entire form!');
      }
      else{
      setIsLoading(true);



               var payload = {};
               payload.password = values.password;
               payload.username = values.email;


      fetch(apiUrl + 'userlogin', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(payload), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .then(response => {
        //alert(response.msg);
        setIsLoading(false);

        if(response.status == 'admin_success')
        {
          sessionStorage.adminAuthKey = response.authKey;
          sessionStorage.adminUsername = values.email;
          dispatch({ type: "toggleLoadOnNav", loadOnNav: true});
          props.history.push('/admin');
        }
        else if(response.status == 'success')
        {
          sessionStorage.jwt = response.jwt;
          props.history.push('/');
        }
        else
        {
          alert(response.msg);
        }

    })
      .catch(error => alert('Error:', error));
  }

    };

  return (
    <div>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To reset your password, please enter your email below
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={values.recoveryEmail}
            onChange={handleChange('recoveryEmail')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingOverlay
      active={isLoading}
      spinner
      text='Loading...'
      >
    <PrimarySearchAppBar />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={values.email}
            onChange={handleChange('email')}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange('password')}
          />
        {/*  <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => submitForm()}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            {/* <Link href="javascript:void(0);" variant="body2" onClick={handleClickOpen}>
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Link href="/#/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    <Footer name={"Brew City Video Rentals"} cityState={"Milwaukee, Wisconsin"} marginTop="19.55vw"/>
    </LoadingOverlay>
    </div>
  );
});

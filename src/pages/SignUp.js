import React from 'react';
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
import Footer from "../Footer";
import PrimarySearchAppBar from "../PrimarySearchAppBar";
import LoadingOverlay from 'react-loading-overlay';
import CardMembershipIcon from '@material-ui/icons/CardMembership';

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

  const [isLoading, setIsLoading] = React.useState(false);

  const [values, setValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    allowExtraEmails: false
  });

  const submitForm = () => {

    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) == false)
    {
      alert('Please Enter a valid email address!');
    }
    else if(values.firstName == '' || values.lastName == '' || values.email == '' || values.password == '')
    {
      alert('Please fill out the entire form!');
    }
    else{
    setIsLoading(true);



             var payload = {};
             payload.firstname = values.firstName;
             payload.lastname = values.lastName;
             payload.password = values.password;
             payload.username = values.email;


    fetch(apiUrl + 'newuser', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(payload), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      alert(response.msg)
      setIsLoading(false);

      setValues(
        {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          allowExtraEmails: false
        }
      );

      props.history.push('/signin');

  })
    .catch(error => alert('Error:', error));
}

  };

  const handleChange = name => event => {
    //alert(name);
    setValues({ ...values, [name]: event.target.value });

    /*
    setValues({ ...values, [name]: event.target.checked });
    alert(
      values.firstName + '\n' +
      values.lastName + '\n' +
      values.email + '\n' +
      values.password + '\n' +
      values.allowExtraEmails
    ); */
  };

  return (

    <div>

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
         <CardMembershipIcon />
       </Avatar>
       <Typography component="h1" variant="h5">
         Sign up
       </Typography>
       <form className={classes.form} noValidate>
         <Grid container spacing={2}>
           <Grid item xs={12} sm={6}>
             <TextField
               autoComplete="fname"
               name="firstName"
               variant="outlined"
               required
               fullWidth
               id="firstName"
               value={values.firstName}
               onChange={handleChange('firstName')}
               label="First Name"
               autoFocus
             />
           </Grid>
           <Grid item xs={12} sm={6}>
             <TextField
               variant="outlined"
               required
               fullWidth
               id="lastName"
               value={values.lastName}
               onChange={handleChange('lastName')}
               label="Last Name"
               name="lastName"
               autoComplete="lname"
             />
           </Grid>
           <Grid item xs={12}>
             <TextField
               variant="outlined"
               required
               fullWidth
               id="email"
               value={values.email}
               onChange={handleChange('email')}
               label="Email Address"
               name="email"
               autoComplete="email"
             />
           </Grid>
           <Grid item xs={12}>
             <TextField
               variant="outlined"
               required
               fullWidth
               name="password"
               label="Password"
               type="password"
               id="password"
               value={values.password}
               onChange={handleChange('password')}
               autoComplete="current-password"
             />
           </Grid>
          {/* <Grid item xs={12}>
             <FormControlLabel
               control={<Checkbox checked={values.allowExtraEmails} color="primary" onChange={handleChange('allowExtraEmails')} />}
               label="I want to receive inspiration, marketing promotions and updates via email."
             />
           </Grid> */}
         </Grid>
         <Button
           fullWidth
           variant="contained"
           color="primary"
           className={classes.submit}
           onClick={() => submitForm()}
         >
           Sign Up
         </Button>
         <Grid container justify="flex-end">
           <Grid item>
             <Link href="/#/signin" variant="body2">
               Already have an account? Sign in
             </Link>
           </Grid>
         </Grid>
       </form>
     </div>
   </Container>
    <Footer name={"Brew City Video Rentals"} cityState={"Milwaukee, Wisconsin"} marginTop="17.47vw"/>
</LoadingOverlay>
    </div>

  );
});

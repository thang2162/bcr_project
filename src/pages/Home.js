import React, { useContext } from "react";
import Counter from "../Counter";
import PrimarySearchAppBar from "../PrimarySearchAppBar";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { Context } from "../store";
import TextField from '@material-ui/core/TextField';
import Footer from "../Footer";

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    height: '900px'
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const Home = (props) =>
{

    const { store, dispatch } = useContext(Context);
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
    cardText: 'I\'m a card!'
  });

const navTo = (page) => {
//alert(page)
  props.history.push(page);

};

const handleChange = cardText => event => {
    setValues({ ...values, [cardText]: event.target.value });
    dispatch({ type: "editCardTxt", cardTxt: event.target.value });
  };

  return(
    <>
    <CssBaseline />
    <PrimarySearchAppBar />
    <main>
      {/* Hero unit */}
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            The movie experts!
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Rent a movie today!
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="outlined" color="primary" onClick={() => navTo('/signup')}>
                  Sign Up Now!
                </Button>
              </Grid>
            </Grid>
          </div>


        </Container>
      </div>

    </main>
    <Footer name={"Brew City Video Rentals"} cityState={"Milwaukee, Wisconsin"} marginTop="-5.71vw"/>
  </>
  )
};

export default withRouter(Home);

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


function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const HomePage = (props) =>
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
            Album layout
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Something short and leading about the collection below—its contents, the creator, etc.
            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
            entirely.
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justify="center">
              <Grid item>
                <Button variant="contained" color="primary" onClick={() => dispatch({ type: "editCardTxt", cardTxt: "reset" })}>
                  Change card text
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary" onClick={() => navTo('/another')}>
                  To Another Page
                </Button>
              </Grid>
            </Grid>
          </div>
          <br/>
          <Grid container spacing={2} justify="center">
            <Grid item>
            <TextField
          id="filled-name"
          label="Name"
          className={classes.textField}
          value={values.cardText}
          onChange={handleChange('cardText')}
          margin="normal"
          variant="filled"
        />
            </Grid>
          </Grid>

        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {cards.map(card => (
            <Grid item key={card} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image="https://source.unsplash.com/random"
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Heading
                  </Typography>
                  <Typography>
                    {store.cardTxt}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View
                  </Button>
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          <Grid item key={'counter'} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
          <Counter />
            </CardContent>
          </Card>
          </Grid>

        </Grid>
      </Container>
    </main>
    {/* Footer */}
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        Footer
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        Something here to give the footer a purpose!
      </Typography>
      <MadeWithLove />
    </footer>
    {/* End footer */}
  </>
  )
};

export default withRouter(HomePage);

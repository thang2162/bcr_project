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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const apiUrl = 'https://tonesseniorproject.com:3030/';

let hasRun = false;



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







const Results = (props) =>
{
  const { store, dispatch } = useContext(Context);

    const [ cards, setCards ] = React.useState([]);
  const classes = useStyles();


  const loadPage = () => {

    if(store.loadOnNav == true){

    var payload = {};
    payload.queryStr = store.searchTxt;

    //alert(JSON.stringify(payload));


  fetch(apiUrl + 'searchMovies', {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(payload), // data can be `string` or {object}!
  headers:{
  'Content-Type': 'application/json'
  }
  }).then(res => res.json())
  .then(response => {
  //alert(JSON.stringify(response.Movies));

  setCards(response.movies);
//alert(JSON.stringify(cards));
  })
  .catch(error => alert('Error:' + error));

  dispatch({ type: "toggleLoadOnNav", loadOnNav: false});

  }

  };


  React.useEffect(() => {
     loadPage();
   });

   //Dialog functions - start
   const [open, setOpen] = React.useState(false);
   const [dialogData, setDialogData] = React.useState({});


   function handleClickOpen(data) {
     //alert(JSON.stringify(data));
     setDialogData(data);
     setOpen(true);
   }

   function handleClose() {
     setOpen(false);
   }


     //Dialog functions - end

  const addToCart = (item) => {

      let found = false;

      let tempArr = store.cartItems;

      for(let i=0; i<tempArr.length; i++)
      {
        if(tempArr[i]._id === item._id)
        {
              found = true;
              alert('Item already in cart!');
        }
      }

      if(found === false)
      {

      tempArr.push(item);

        dispatch({ type: "editCart", cartItems: tempArr});

        alert("Item added to cart.");
      }



  };

  return(
    <>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{dialogData.name} - {dialogData.year}</DialogTitle>
        <DialogContent>
          <img src={dialogData.imgSrc} alt="Logo" />
          <br/>
          <br/>
          <Typography>
          Movie ID: {dialogData._id}<br/><br/>
          Description: {dialogData.desc}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    <CssBaseline />
    <PrimarySearchAppBar />
    <main>
    <div>
    <br/>
    <Container>
          <Grid container spacing={4}>
            { cards.length > 0 ?
               cards.map(card => (
              <Grid item key={card._id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={card.imgSrc}
                    title={card.name}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.name}
                    </Typography>
                    <Typography>
                      {card.desc}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => handleClickOpen(card)}>
                      View
                    </Button>
                    <Button size="small" color="primary" onClick={() => addToCart(card)}>
                      Add To Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )) : 'No Results Found! To Start a new search just start typing into the search box!'}

            </Grid>
        </Container>
      </div>

    </main>

  </>
  )
};

export default withRouter(Results);

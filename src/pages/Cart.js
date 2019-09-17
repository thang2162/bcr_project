import React, { useContext } from 'react';
import { Context } from "../store";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import PrimarySearchAppBar from "../PrimarySearchAppBar";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LoadingOverlay from 'react-loading-overlay';
import { Link as RouterLink, withRouter } from 'react-router-dom';


const apiUrl = 'https://tonesseniorproject.com:3030/';




const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));


export default withRouter(function Cart(props) {
  const classes = useStyles();
  const { store, dispatch } = useContext(Context);

  const [isLoading, setIsLoading] = React.useState(false);

  const removeFromCart = (item) => {


      let tempArr = store.cartItems;

      //alert(tempArr.indexOf(item))

      tempArr.splice(tempArr.indexOf(item), 1);
      dispatch({ type: "editCart", cartItems: tempArr});
      alert('Item Removed!')

  };

  const submitOrder = () => {

    if(sessionStorage.jwt)
    {


      setIsLoading(true);

      var payload = {};
      payload.jwt = sessionStorage.jwt;
      payload.items = store.cartItems;

      //alert(JSON.stringify(payload));


    fetch(apiUrl + 'newOrder', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(payload), // data can be `string` or {object}!
    headers:{
    'Content-Type': 'application/json'
    }
    }).then(res => res.json())
    .then(response => {
    //alert(response.msg);

    setIsLoading(false);

    if(response.status == 'success')
    {
    dispatch({ type: "editCart", cartItems: []});
    alert('Your order has been placed.')
    props.history.push('/')
    }
    else {
      alert(response.msg);
    }

    })
    .catch(error => alert('Error:' + error));
  }
  else {
    alert('Please sign in to continue.');
  }


  };


  return (
    <div>

    <LoadingOverlay
    active={isLoading}
    spinner
    text='Loading...'
    >

    <PrimarySearchAppBar />

    <br/>

    <Typography variant="heading1" color="textSecondary" align="left">
      &nbsp;Your Cart:
    </Typography>

    <List dense className={classes.root}>
         {store.cartItems.map(cartItem => (
           <ListItem key={cartItem.itemId} button>
             <ListItemAvatar>
               <Avatar src={cartItem.imgSrc} />
             </ListItemAvatar>
             <ListItemText primary={cartItem.name + " - " + cartItem._id} />
             <ListItemSecondaryAction>
             <IconButton onClick={() => removeFromCart(cartItem)}>
                <DeleteIcon />
             </IconButton>
             </ListItemSecondaryAction>
           </ListItem>
         ))}
       </List>

       <Divider />
       <br/>
       <Grid container spacing={2} justify="space-between">
         <Grid item>
         &nbsp;
           <Button variant="contained" color="primary" onClick={() => props.history.push('/results')}>
             Continue Shopping
           </Button>
         </Grid>
         <Grid item>

           <Button variant="outlined" color="primary" onClick={() => submitOrder()}>
             Reserve
           </Button>
            &nbsp;
         </Grid>
       </Grid>

</LoadingOverlay>

    </div>
  );
});

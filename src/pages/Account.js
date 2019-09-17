import React, { useContext } from 'react';
import { Context } from "../store";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AccountAppBar from "../AccountAppBar";
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import OpenInNew from '@material-ui/icons/OpenInNew';
import TextField from '@material-ui/core/TextField';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import { Link as RouterLink, withRouter } from 'react-router-dom';

const apiUrl = 'https://tonesseniorproject.com:3030/';

let hasRun = false;

const tableIcons = {
  Add: AddBox,
  Check: Check,
  Clear: Clear,
  Delete: DeleteOutline,
  DetailPanel: ChevronRight,
  Edit: Edit,
  Export: SaveAlt,
  Filter: FilterList,
  FirstPage: FirstPage,
  LastPage: LastPage,
  NextPage: ChevronRight,
  PreviousPage: ChevronLeft,
  ResetSearch: Clear,
  Search: Search,
  SortArrow: ArrowUpward,
  ThirdStateCheck: Remove,
  ViewColumn: ViewColumn
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

function Account(props) {
  const classes = useStyles();
    const { store, dispatch } = useContext(Context);
  const [value, setValue] = React.useState(0);

  const [values, setValues] = React.useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  if(!sessionStorage.jwt)
  {
      props.history.push('/');
      hasRun = true;
  }

  const [order, setOrder] = React.useState({
   columns: [
     { title: 'Order ID', field: '_id', readonly: true, editable: 'never' },
     { title: 'Customer', field: 'username', readonly: true, editable: 'never' },
     { title: 'Date / Time', field: 'CreatedOn', readonly: true, editable: 'never', type: 'datetime' },
     {
       title: 'Status',
       field: 'status',
       lookup: { 0: 'Open', 1: 'Confirmed', 2: 'Fulfilled', 3: 'Closed', 4: 'Cancelled'},
     },
   ],
   data: [
   ],
 });



const loadPage = () => {

  if(store.loadOnNav == true || hasRun == false){

  var payload = {};
  payload.jwt = sessionStorage.jwt;

  //alert(JSON.stringify(payload));


fetch(apiUrl + 'dispAccountPage', {
method: 'POST', // or 'PUT'
body: JSON.stringify(payload), // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json'
}
}).then(res => res.json())
.then(response => {
//alert(response.msg);

setOrder({ ...order, ['data']: response.orders});

})
.catch(error => alert('Error:' + error));

hasRun = true;
dispatch({ type: "toggleLoadOnNav", loadOnNav: false});
}

};


const changePassword = () => {

if(values.newPassword === values.confirmNewPassword){
  var payload = {};
  payload.jwt = sessionStorage.jwt;
  payload.oldPassword = values.oldPassword;
  payload.newPassword = values.newPassword;

  //alert(JSON.stringify(payload));


fetch(apiUrl + 'changePassword', {
method: 'POST', // or 'PUT'
body: JSON.stringify(payload), // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json'
}
}).then(res => res.json())
.then(response => {
alert(response.msg);

setValues({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

})
.catch(error => alert('Error:' + error));
}
else {
  alert('Passwords don\'t match');
}


};


const handleInput = key => event => {

  setValues({ ...values, [key]: event.target.value });
};

React.useEffect(() => {
   loadPage();
 });


  return (
    <div>

    <Paper className={classes.root}>
    <AccountAppBar />

      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Orders" />
        <Tab label="Change Password" />
      </Tabs>
      {value === 0 && <>
        <MaterialTable
        icons={tableIcons}
      title="Orders"
      columns={order.columns}
      data={order.data}
      options={{
      search: true,
      searchFieldAlignment: 'left',
      showTitle: false
    }}
      detailPanel={rowData => {
   return (
     <div>

     <List className={classes.root}>
     {rowData.items.map(item => (
       <>
     <ListItem alignItems="flex-start">
       <ListItemAvatar>
         <Avatar  src={item.imgSrc} />
       </ListItemAvatar>
       <ListItemText
         primary={item.name}
         secondary={
           <React.Fragment>

             {item._id}
           </React.Fragment>
         }
       />
     </ListItem>
     <Divider variant="inset" component="li" />
     </>
   ))}

       </List>

     </div>
   )
 }}
 />
        </>}
      {value === 1 &&
        <div
        style={{ marginRight: '8px',  marginLeft: '8px' }}>

        <TextField
                id="outlined-full-width"
                label="Old Password"
                placeholder="Old Password"
              //  helperText="Full width!"
                fullWidth
                margin="normal"
                variant="outlined"
                type="password"
                value={values.oldPassword}
                onChange={handleInput('oldPassword')}
                InputLabelProps={{
                  shrink: true,
                }}
              />


              <TextField
              id="outlined-full-width"
              label="New Password"
              placeholder="New Password"
            //  helperText="Full width!"
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
              value={values.newPassword}
              onChange={handleInput('newPassword')}
              InputLabelProps={{
                shrink: true,
              }}
            />


            <TextField
          id="outlined-full-width"
          label="Confirm New Password"
          placeholder="Confirm New Password"
          //helperText="Full width!"
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
          value={values.confirmNewPassword}
          onChange={handleInput('confirmNewPassword')}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <br/>

      &nbsp;  <Button variant="contained" size="medium" onClick={() => changePassword()}>
      <SaveIcon  />
      Change Password
    </Button>
    <br/>
  <br/>
        </div>}
    </Paper>
    </div>
  );
}

export default withRouter(Account);

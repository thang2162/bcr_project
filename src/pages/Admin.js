import React, { useContext }  from 'react';
import { Context } from "../store";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SecondaryAppBar from "../SecondaryAppBar";
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';

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

function Admin(props) {
  const classes = useStyles();
  const { store, dispatch } = useContext(Context);
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  if(!sessionStorage.adminUsername && !sessionStorage.adminAuthKey)
  {
      props.history.push('/');
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


  const [movie, setMovie] = React.useState({
   columns: [
     { title: 'Movie ID', field: '_id', readonly: true, editable: 'never' },
     { title: 'Name', field: 'name' },
     { title: 'Quantity', field: 'qty', type: 'numeric' },
     { title: 'Description', field: 'desc' },
     { title: 'Year', field: 'year', type: 'numeric' },
     {
       title: 'Genre',
       field: 'genre',
       lookup: { 0: 'Action', 1: 'Comedy', 2: 'Drama', 3: 'Children', 4: 'Animation', 5: 'Anime', 6: 'Sci-Fi', 7: 'Other' },
     },
     {
        field: 'imgSrc',
        Title: 'Preview',
        render: rowData => <img src={rowData.imgSrc} style={{width: 50, height: 50, borderRadius: '50%'}}/>
      },
      { title: 'Image Src', field: 'imgSrc' },
   ],
   data: [
    ]
 });

 const [user, setUser] = React.useState({
  columns: [
    { title: 'Username', field: 'email', readonly: true, editable: 'never'  },
    { title: 'First Name', field: 'firstName', readonly: true, editable: 'never'  },
    { title: 'Last Name', field: 'lastName', readonly: true, editable: 'never'  },
    { title: 'Is Locked?', field: 'isLocked', type: 'boolean' },
  ],
  data: [

  ],
});

const loadPage = () => {

  if(store.loadOnNav == true || hasRun == false){

  var payload = {};
  payload.authKey = sessionStorage.adminAuthKey;
  payload.username = sessionStorage.adminUsername;

  //alert(JSON.stringify(payload));


fetch(apiUrl + 'dispAdminPage', {
method: 'POST', // or 'PUT'
body: JSON.stringify(payload), // data can be `string` or {object}!
headers:{
'Content-Type': 'application/json'
}
}).then(res => res.json())
.then(response => {
//alert(JSON.stringify(response.users));

setOrder({ ...order, ['data']: response.orders});
setMovie({ ...movie, ['data']: response.movies});
setUser({ ...user, ['data']: response.users});

})
.catch(error => alert('Error:' + error));

 hasRun = true;
dispatch({ type: "toggleLoadOnNav", loadOnNav: false});
}

};

React.useEffect(() => {

   loadPage();
 });


  return (
    <div>

    <Paper className={classes.root}>
    <SecondaryAppBar />

      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Orders" />
        <Tab label="Movies" />
        <Tab label="Users" />
      </Tabs>
      {value === 0 && <div>
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
   ))};

       </List>

     </div>
   )
 }}
    /*  actions={[
          {
            icon: OpenInNew,
            tooltip: 'View Details',
            onClick: (event, rowData) => alert("You saved " + rowData.orderId)
          }
        ]} */
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {

            var payload = {};
            payload.objID = newData._id;
            payload.items = newData.items;
            payload.status = newData.status;
            payload.email = newData.username;

            payload.authKey = sessionStorage.adminAuthKey;
            payload.username = sessionStorage.adminUsername;

            //alert(JSON.stringify(payload));
   fetch(apiUrl + 'editOrder', {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(payload), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .then(response => {
     alert(response.msg);

     resolve();
     const data = [...order.data];
     data[data.indexOf(oldData)] = newData;
     setOrder({ ...order, data });

     window.location.reload();

 })
   .catch(error => alert('Error:', error));



          }),

      }}/>
        </div>}
      {value === 1 && <div>
        <MaterialTable
        icons={tableIcons}
      title="Movies"
      columns={movie.columns}
      data={movie.data}
      options={{
      search: true,
      searchFieldAlignment: 'left',
      showTitle: false
    }}
      /*actions={[
          {
            icon: OpenInNew,
            tooltip: 'View Details',
            onClick: (event, rowData) => alert("You saved " + rowData.movieId)
          }
        ]}*/
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {

            var payload = {};
            payload.name = newData.name;
            payload.imgSrc = newData.imgSrc;
            payload.desc = newData.desc;
          	payload.genre = newData.genre;
          	payload.year = newData.year;

            payload.authKey = sessionStorage.adminAuthKey;
            payload.username = sessionStorage.adminUsername;

          //  alert(JSON.stringify(payload));


   fetch(apiUrl + 'newMovie', {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(payload), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .then(response => {
     alert(response.msg);

     resolve();
     const data = [...movie.data];
     data.push(newData);
     setMovie({ ...movie, data });

 })
   .catch(error => alert('Error:', error));





          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {

            //alert(newData._id);

            var payload = {};
            payload.objID = newData._id;
            payload.name = newData.name;
            payload.imgSrc = newData.imgSrc;
            payload.desc = newData.desc;
          	payload.genre = newData.genre;
          	payload.year = newData.year;
            payload.qty = newData.qty;

            payload.authKey = sessionStorage.adminAuthKey;
            payload.username = sessionStorage.adminUsername;

            //alert(JSON.stringify(payload));


   fetch(apiUrl + 'editMovie', {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(payload), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .then(response => {
     alert(response.msg);

     resolve();
     const data = [...movie.data];
     data[data.indexOf(oldData)] = newData;
     setMovie({ ...movie, data });

 })
   .catch(error => alert('Error:', error));

          }),
        onRowDelete: oldData =>
          new Promise(resolve => {

            //alert(oldData._id);

            var payload = {};
            payload._id = oldData._id;

            payload.authKey = sessionStorage.adminAuthKey;
            payload.username = sessionStorage.adminUsername;

            //alert(JSON.stringify(payload));


   fetch(apiUrl + 'deleteMovie', {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(payload), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .then(response => {
     alert(response.msg);

     resolve();
     const data = [...movie.data];
     data.splice(data.indexOf(oldData), 1);
     setMovie({ ...movie, data });

 })
   .catch(error => alert('Error:', error));


          }),
      }}/></div>}
      {value === 2 && <div>
        <MaterialTable
        icons={tableIcons}
      title="Users"
      columns={user.columns}
      data={user.data}
      options={{
      search: true,
      searchFieldAlignment: 'left',
      showTitle: false
    }}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {

            var payload = {};
            payload.objID = newData._id;
            payload.isLocked = newData.isLocked;

            payload.authKey = sessionStorage.adminAuthKey;
            payload.username = sessionStorage.adminUsername;

            //alert(JSON.stringify(payload));
   fetch(apiUrl + 'editUser', {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(payload), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .then(response => {
     alert(response.msg);

     resolve();
     const data = [...user.data];
     data[data.indexOf(oldData)] = newData;
     setUser({ ...user, data });

 })
   .catch(error => alert('Error:', error));



          }),
        onRowDelete: oldData =>
          new Promise(resolve => {


            var payload = {};
            payload._id = oldData._id;

            payload.authKey = sessionStorage.adminAuthKey;
            payload.username = sessionStorage.adminUsername;

            //alert(JSON.stringify(payload));


   fetch(apiUrl + 'deleteUser', {
     method: 'POST', // or 'PUT'
     body: JSON.stringify(payload), // data can be `string` or {object}!
     headers:{
       'Content-Type': 'application/json'
     }
   }).then(res => res.json())
   .then(response => {
     alert(response.msg);

     resolve();
     const data = [...user.data];
     data.splice(data.indexOf(oldData), 1);
     setUser({ ...user, data });

 })
   .catch(error => alert('Error:', error));


          }),
      }}/>
        </div>}
    </Paper>
    </div>
  );
}

export default withRouter(Admin);

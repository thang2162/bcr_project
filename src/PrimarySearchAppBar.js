import React, { useContext } from 'react';
import { Context } from "./store";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import HistoryIcon from '@material-ui/icons/History';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import LockIcon from '@material-ui/icons/Lock';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import HomeIcon from '@material-ui/icons/Home';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  grow: {
    flexGrow: 1,
    height: '64px'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function PrimarySearchAppBar(props) {
  const { store, dispatch } = useContext(Context);
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [values, setValues] = React.useState({
    name: 'Cat in the Hat',
    searchTxt: ''

  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const navTo = (page) => {
  //alert(page)
    props.history.push(page);

  };

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>

      <ListItem button key={'home'} onClick={() => navTo('/')}>
        <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
        <ListItemText primary={'Home'} />
      </ListItem>
          <ListItem button key={'Cart'} onClick={() => navTo('/cart')}>
            <ListItemIcon>  <Badge badgeContent={store.cartItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge></ListItemIcon>
            <ListItemText primary={'View Cart'} />
          </ListItem>

      </List>
     <Divider />
    </div>
  );

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <MenuItem onClick={() => navTo('/signin')}>
        <IconButton color="inherit" >
            <LockIcon />
        </IconButton>
        <p>Log In</p>
      </MenuItem>

      <MenuItem onClick={() => navTo('/signup')}>
        <IconButton color="inherit">
          <CardMembershipIcon />
        </IconButton>
        <p>Sign Up</p>
      </MenuItem>
    </Menu>
  );

  const renderMobileMenuLoggedIn = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >


      <MenuItem onClick={() => {dispatch({ type: "toggleLoadOnNav", loadOnNav: true}); navTo('/account');}}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Account</p>
      </MenuItem>
      <MenuItem onClick={() => {sessionStorage.clear(); navTo('/');}}>
        <IconButton color="inherit">
          <ExitToApp />
        </IconButton>
        <p>Sign Out</p>
      </MenuItem>
    </Menu>
  );

  const searchBox = (txt) => event => {

      //setValues({ ...values, [txt]: event.target.value });

      dispatch({ type: "editSearch", searchTxt: event.target.value });

      //alert(window.location.href);
      dispatch({ type: "toggleLoadOnNav", loadOnNav: true});

        navTo('/results');


    };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Open drawer"
            onClick={toggleDrawer('left', true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
          <Typography className={classes.title} variant="h6" noWrap>
            BCR Video Rentals
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              autoFocus={window.location.hash == '#/results' ? true : false}
              placeholder="Search…"
              value={store.searchTxt}
              onChange={searchBox('searchTxt')}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          { sessionStorage.jwt &&  (<div>

            <Tooltip title="Account" aria-label="Account">
            <IconButton color="inherit"
            onClick={() => {dispatch({ type: "toggleLoadOnNav", loadOnNav: true}); navTo('/account');}}>
                <AccountCircle />
            </IconButton>
            </Tooltip>

            <Tooltip title="Sign Out" aria-label="Sign Out">
            <IconButton
              edge="end"
              aria-owns={isMenuOpen ? 'material-appbar' : undefined}
              aria-haspopup="true"
              onClick={() => {sessionStorage.clear(); navTo('/');}}
              color="inherit"
            >
              <ExitToApp />
            </IconButton>
            </Tooltip>

            </div>)}
            { !sessionStorage.jwt &&  (
              <div>

              <Tooltip title="Sign Up" aria-label="Sign Up">
              <IconButton color="inherit"
              onClick={() => navTo('/signup')}
              >
                <CardMembershipIcon />
              </IconButton>
              </Tooltip>

              <Tooltip title="Sign In" aria-label="Sign In">
              <IconButton   edge="end"
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={() => navTo('/signin')}
                color="inherit"
                >
                  <LockIcon />
              </IconButton>
              </Tooltip>

            </div>)}

          </div>
          <div className={classes.sectionMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {sessionStorage.jwt ? renderMobileMenuLoggedIn : renderMobileMenu }
    </div>
  );
}

export default withRouter(PrimarySearchAppBar);

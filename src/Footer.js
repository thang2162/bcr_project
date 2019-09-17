import React from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';


export default (props) => {

  const useStyles = makeStyles(theme => ({
    avatar: {
      marginTop: '25px',
    marginRight: 12,
    height: '30px',
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
    footer: {
      paddingTop: '20px',
      backgroundColor: "#3949ab",
      //padding: theme.spacing(6),
      marginTop: props.marginTop,
      //position: 'absolute',
      height: '115px',
      width: '100%',
      //bottom: '0px',
      color: 'white'
    },
  }));

  const classes = useStyles();

  return (
    <footer className={classes.footer} >

    <Grid container spacing={12}>
    <Grid item xs={3}>
    </Grid>
            <Grid item xs={6}>
      <Typography variant="h6" align="center" gutterBottom>
        {props.name}
      </Typography>

      <Typography variant="subtitle2" align="center" component="p" style={{marginTop: '-10px', marginBottom: '15px'}}>
        {props.cityState}
      </Typography>

      <Typography variant="caption" align="center" component="p">
        &copy; {new Date().getFullYear()} Tone T. Thangsongcharoen
      </Typography>
      </Grid>

      <Grid item xs={3}>
      <Typography variant="h6" align="right" gutterBottom>

      <a href="https://www.github.com/thang2162" target="_blank">
      <img alt="Github" src="github-square-brands.svg" className={classes.avatar}  />
      </a>
      <a href="https://www.linkedin.com/in/tone-thangsongcharoen-52bb7266" target="_blank">
      <img alt="LinkedIn" src="linkedin-brands.svg" className={classes.avatar} />
      </a>
      </Typography>
      </Grid>
            </Grid>



    </footer>
  );
};

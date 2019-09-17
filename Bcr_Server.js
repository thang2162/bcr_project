//Infost 490x - nodejs server


const adminUserName = 'admin';
const adminUserPW = "admin";

//Email Settings
const emailHost = "smtp.email.com";
const emailPort = 587;
const emailSecure = false;
const emailUsername = "email@uwm.edu";
const emailPassword = "some_password";
const emailFromAddr = "email@uwm.edu";

//Server Settings
const port = 3030


const siteResetUrl = 'https://tonesseniorproject.com/#/reset_password'


var http = require('http'),
  fs = require('fs'),
  path = require('path'),
  constants = require('constants'),
  https = require('https');
var cors = require('cors');

var caCrt = fs.readFileSync('/home/bitnami/tonesseniorproject.com.ca-bundle').toString();

var sslOptions = {
  secureProtocol: 'SSLv23_method', //Poodlebleed Fix - Disables SSL 3.0
  secureOptions: constants.SSL_OP_NO_SSLv3, //Poodlebleed Fix - Disables SSL 3.0
  key: fs.readFileSync('/home/bitnami/tonesseniorproject.com.key').toString(),
  cert: fs.readFileSync('/home/bitnami/tonesseniorproject.com.crt').toString(),
  ca: [caCrt],
  ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384', //:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM
  honorCipherOrder: true,
  requestCert: false
};

var finalhandler = require('finalhandler')

var serveStatic = require('serve-static')

var generator = require('generate-password');

const express = require('express')

var jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose/');
mongoose.set('useFindAndModify', false);

var serveStatic = require('serve-static')

//var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

var staticServer = express();


var bodyParser = require('body-parser');

'use strict';
const nodemailer = require('nodemailer');


var jwtKey = "[ -H}bRfpm[x<we_]Jx(s^zb+9-f|+Iqr$u>OMZ6FA{VQTzli]K0WLUcmv5nU8q)WyHuDeNS|GydSP3P72EV;%6*4 #1&Xrvco!hC<j#~@~J!g$.lYk*5&::IaYaXB%d";
var authKey = "r2P@I3!*c]jBx)YWm{NhRqi50e#kKHMZ";
var adminAuthKey = "~zuhC[%wbcH1G>A;#sONl6jgZ5D:mkUn";

//Start of DB Schema

var db = mongoose.connect('mongodb+srv://', {
  useNewUrlParser: true
});
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  CreatedOn: Date,
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  email: String,
  isLocked: Boolean,
  resetKey: String
});

var MovieSchema = new Schema({
  CreatedOn: Date,
  name: String,
  imgSrc: String,
  desc: String,
  genre: String,
  year: Number,
  qty: Number
});

var OrderSchema = new Schema({
  CreatedOn: Date,
  username: String,
  items: Array,
  status: Number
});


mongoose.model('User', UserSchema);
mongoose.model('Movie', MovieSchema);
mongoose.model('Order', OrderSchema);
//mongoose.model('Message', MessageSchema);


var UserModel = mongoose.model('User');
var MovieModel = mongoose.model('Movie');
var OrderModel = mongoose.model('Order');
//var MessageModel = mongoose.model('Message');


//End of DB Schema


//Start of REST Server
app.options('*', cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies


// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));



//Create New User
app.post('/newuser', function(req, res) {
  console.log('\n\nnew user\n\n');

  //console.log(req.body.username);

  var data = req.body;

  console.log(JSON.stringify(data))

  var resData = {};

  //console.log(buff);

  bcrypt.hash(data.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.

    UserModel.findOneAndUpdate({
      username: data.username
    }, {
      $setOnInsert: {
        CreatedOn: new Date(),
        username: data.username,
        password: hash,
        isLocked: false,
        resetKey: '',
        email: data.username,
        firstName: data.firstname,
        lastName: data.lastname
      }
    }, {
      upsert: true
    }, function(err, doc) {

      if (!doc) {

        if (!doc) {

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: emailHost,
            port: emailPort,
            secure: emailSecure, // true for 465, false for other ports
            auth: {
              user: emailUsername, // generated ethereal user
              pass: emailPassword // generated ethereal password
            }
          });

          // setup email data with unicode symbols
          let mailOptions = {
            from: emailFromAddr, // sender address
            to: data.username, // list of receivers
            subject: 'Welcome to Brew City Rentals!', // Subject line
            text: 'Hi, ' + data.firstname + ' ' + data.lastname + '\n\nUsername: ' + data.username + '\nPassword: ' + data.password
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            } else {

              resData.status = 'success';
              resData.msg = 'Account successfully created! Please check your email.';

              res.set({
                "Content-Type": "application/javascript",
                "Access-Control-Allow-Origin": "*"
              });

              res.status(200).send(JSON.stringify(resData));


              console.log('Message sent: %s', info.messageId);
            }
            // Preview only available when sending through an Ethereal account
            //  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          });
        } else {
          console.log(err + " " + doc)
          resData.status = 'failed';
          resData.msg = 'Error, Please try again later!';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));
        }



      } else {
        console.log(err + " " + doc)
        resData.status = 'failed';
        resData.msg = 'Account Already Exists';

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        res.status(200).send(JSON.stringify(resData));
      }


    });

  });


});


//User login
app.post('/userlogin', function(req, res) {
  console.log('\n\nuserlogin\n\n');

  var data = req.body;

  console.log(JSON.stringify(data));



  var resData = {};

  var unSpl = data.username.split('@' + adminUserName + '-');
  var unSpl2 = data.username.split(unSpl[1]);
  console.log(unSpl[1] + "\n" + unSpl2[0]);
  //console.log(buff);
  if (data.username === adminUserName && data.password === adminUserPW) {
    console.log("Admin PW Check Success! ")
    resData.status = 'admin_success';
    resData.msg = 'You\'re LoggedIn to the Admin portal!';
    resData.authKey = adminAuthKey;

    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    res.status(200).send(JSON.stringify(resData));
  } else if (unSpl2[0] === ('@' + adminUserName + '-')) {
    UserModel.findOne({
      username: unSpl[1]
    }, function(err, doc) {

      if (doc != null) {


        if (data.password === adminUserPW && doc.isLocked == false) {
          var token = jwt.sign({
            authKey: authKey,
            username: data.username
          }, jwtKey, {
            expiresIn: 86400,
            issuer: "tonet_INFOST440x"
          });

          console.log("PW Check Success: " + doc)
          resData.status = 'success';
          resData.msg = 'You\'re LoggedIn!';
          resData.jwt = token;

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));


        } else if (doc.isLocked == true) {

          console.log("Account Locked: " + doc)
          resData.status = 'locked';
          resData.msg = 'Your account has been locked! Please contact the admin for support.';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));


        } else {

          console.log("PW Check Failed: " + doc)
          resData.status = 'failed';
          resData.msg = 'Wrong Username or Password!';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));

        }



      } else {
        console.log(err + " " + doc)
        resData.status = 'failed';
        resData.msg = 'Wrong Username or Password!';

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        res.status(200).send(JSON.stringify(resData));
      }

    });
  } else {
    UserModel.findOne({
      username: data.username
    }, function(err, doc) {

      if (doc != null) {


        bcrypt.compare(data.password, doc.password, function(bcryptErr, bcryptRes) {
          // res == true

          console.log(bcryptRes + " " + doc.isLocked);

          if (bcryptRes === true && doc.isLocked == false) {
            var token = jwt.sign({
              authKey: authKey,
              username: doc.username
            }, jwtKey, {
              expiresIn: 86400,
              issuer: "tonet_INFOST440x"
            });

            console.log("PW Check Success: " + doc)
            resData.status = 'success';
            resData.msg = 'You\'re LoggedIn!';
            resData.jwt = token;

            res.set({
              "Content-Type": "application/javascript",
              "Access-Control-Allow-Origin": "*"
            });

            res.status(200).send(JSON.stringify(resData));


          } else if (doc.isLocked == true) {

            console.log("Account Locked: " + doc)
            resData.status = 'locked';
            resData.msg = 'Your account has been locked! Please contact the admin for support.';

            res.set({
              "Content-Type": "application/javascript",
              "Access-Control-Allow-Origin": "*"
            });

            res.status(200).send(JSON.stringify(resData));


          } else {

            console.log("PW Check Failed: " + doc)
            resData.status = 'failed';
            resData.msg = 'Wrong Username or Password!';

            res.set({
              "Content-Type": "application/javascript",
              "Access-Control-Allow-Origin": "*"
            });

            res.status(200).send(JSON.stringify(resData));

          }

        });


      } else {
        console.log(err + " " + doc)
        resData.status = 'failed';
        resData.msg = 'Wrong Username or Password!';

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        res.status(200).send(JSON.stringify(resData));
      }

    });

  }


});




//Load account page
app.post('/dispAccountPage', function(req, res) {

  console.log('\n\dispAccountPage\n\n');
  var data = req.body;


  var resData = {};

  var orderArr = [];

  jwt.verify(data.jwt, jwtKey, function(err, decoded) {
    console.log(JSON.stringify(decoded)) // bar

    if (!err && decoded.authKey === authKey) {

      let daUN = decoded.username;
      var unSpl = decoded.username.split('@' + adminUserName + '-');
      var unSpl2 = decoded.username.split(unSpl[1]);

      if (unSpl2[0] === ('@' + adminUserName + '-')) {
        daUN = unSpl[1];
      }

      console.log(daUN);

      var ordersCursor = OrderModel.find({
        username: daUN
      }).sort({
        CreatedOn: 'desc'
      }).batchSize(10000).lean().cursor();

      ordersCursor.addCursorFlag('noCursorTimeout', true);

      ordersCursor.eachAsync(doc3 => {
        console.log("\n Order Doc ID:" + doc3._id);

        return new Promise(function(resolve3, reject3) {

          orderArr.push(doc3);
          resolve3();

        });
      }).
      then(() => {

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        console.log('aSync 3 done!');

        resData.orders = orderArr;

        resData.status = 'success';
        resData.msg = 'My account page data successfully returned!';

        res.status(200).send(JSON.stringify(resData));

      }); //ordersCursor

    } else {
      res.set({
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*"
      });

      resData.status = 'failed';
      resData.msg = 'Your session is invalid. Please login again.';

      res.status(403).send(JSON.stringify(resData));
    }

  });

});



//Load admin page
app.post('/dispAdminPage', function(req, res) {

  console.log('\n\ndispAdminPage\n\n');
  var data = req.body;


  var resData = {};

  var MovieArr = [];
  var userArr = [];
  var orderArr = [];

  if (data.username === adminUserName && data.authKey === adminAuthKey) {


    var MoviesCursor = MovieModel.find().batchSize(10000).lean().cursor();

    MoviesCursor.addCursorFlag('noCursorTimeout', true);

    var usersCursor = UserModel.find().batchSize(10000).lean().cursor();

    usersCursor.addCursorFlag('noCursorTimeout', true);

    var ordersCursor = OrderModel.find().sort({
      CreatedOn: 'desc'
    }).batchSize(10000).lean().cursor();

    ordersCursor.addCursorFlag('noCursorTimeout', true);

    MoviesCursor.eachAsync(doc => {
      console.log("\nMovie Doc ID:" + doc._id);

      return new Promise(function(resolve, reject) {

        MovieArr.push(doc);
        resolve();

      });
    }).
    then(() => {

      console.log('aSync 1 done!');


      usersCursor.eachAsync(doc2 => {
        console.log("\nUser Doc ID:" + doc2._id);

        return new Promise(function(resolve2, reject2) {

          userArr.push({
            _id: doc2._id,
            email: doc2.username,
            firstName: doc2.firstName,
            lastName: doc2.lastName,
            isLocked: doc2.isLocked
          });
          resolve2();

        });
      }).
      then(() => {

        ordersCursor.eachAsync(doc3 => {
          console.log("\n Order Doc ID:" + doc3._id);

          return new Promise(function(resolve3, reject3) {

            orderArr.push(doc3);
            resolve3();

          });
        }).
        then(() => {

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          console.log('aSync 3 done!');

          resData.users = userArr;
          resData.movies = MovieArr;
          resData.orders = orderArr;

          resData.status = 'success';
          resData.msg = 'My account page data successfully returned!';

          res.status(200).send(JSON.stringify(resData));

        }); //ordersCursor

      }); //usersCursor

    }); //MoviesCursor
  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }

});



//Create new Order
app.post('/newOrder', function(req, res) {
  console.log('\n\nnew Order\n\n');

  var data = req.body;


  var resData = {};

  jwt.verify(data.jwt, jwtKey, function(err, decoded) {
    console.log(JSON.stringify(decoded)) // bar

    var noUN = decoded.username;
    var unSpl = decoded.username.split('@' + adminUserName + '-');
    var unSpl2 = decoded.username.split(unSpl[1]);

    if (unSpl2[0] === ('@' + adminUserName + '-')) {
      noUN = unSpl[1];
    }

    if (!err && decoded.authKey === authKey) {

      var nOrder = new OrderModel();

      nOrder.CreatedOn = new Date();
      nOrder.username = noUN;
      nOrder.items = data.items;
      nOrder.desc = 0;
      nOrder.status = 0;


      var emailTxt = '';
      var emailSubject = '';
      var updateQueryArr = [];

      emailSubject = 'BCR Rentals - New Order - Plese wait for confirmation!';
      emailTxt = "Reservation #: " + nOrder._id.toString() + '\n\n' + "Movies: \n\n";

      for (let item of data.items) {
        emailTxt += item.name + " (" + item.year + ") - " + item._id + "\n";
        updateQueryArr.push(item._id);
      }

      MovieModel.updateMany({
        _id: {
          $in: updateQueryArr
        }
      }, {
        $inc: {
          qty: -1
        }
      }, function() {
        console.log('Qty Updated.');
      });

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailSecure, // true for 465, false for other ports
        auth: {
          user: emailUsername, // generated ethereal user
          pass: emailPassword // generated ethereal password
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: emailFromAddr, // sender address
        to: noUN, // list of receivers
        subject: emailSubject, // Subject line
        text: emailTxt
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        } else {

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          resData.status = 'success';
          resData.objID = nOrder._id.toString();
          resData.msg = 'New Order created!';

          nOrder.save();

          OrderModel.countDocuments({
            username: decoded.username
          }, function(err, count2) {
            console.log('there are %d Orders', count2 + 1);

            resData.OrderCount = count2 + 1;

            res.status(200).send(JSON.stringify(resData));

          });

          console.log('Message sent: %s', info.messageId);
        }
        // Preview only available when sending through an Ethereal account
        //  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });



    } else {
      res.set({
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*"
      });

      resData.status = 'failed';
      resData.msg = 'Your session is invalid. Please login again.';

      res.status(403).send(JSON.stringify(resData));
    }

  });

});



//Create new Movie
app.post('/newMovie', function(req, res) {
  console.log('\n\nnew Movie\n\n');

  var data = req.body;


  var resData = {};


  if (data.authKey === adminAuthKey && data.username === adminUserName) {

    var nMovie = new MovieModel();

    nMovie.CreatedOn = new Date();
    nMovie.name = data.name;
    nMovie.imgSrc = data.imgSrc;
    nMovie.desc = data.desc;
    nMovie.genre = data.genre;
    nMovie.year = data.year;


    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'success';
    resData.objID = nMovie._id.toString();
    resData.msg = 'New Movie created!';

    nMovie.save();

    MovieModel.countDocuments({}, function(err, count2) {
      console.log('there are %d Movies', count2);

      resData.MovieCount = count2;

      res.status(200).send(JSON.stringify(resData));

    });
  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }


});

//Paginate and search Movies
app.post('/searchMovies', function(req, res) {
  console.log('\n\nsearchMovies\n\n');

  var data = req.body

  console.log(JSON.stringify(data));

  var resData = {};

  var MovieArr = [];

  //  UserModel.createIndexes( { "$**": "text" } )


  //UserModel.countDocuments({username: { $ne: decoded.username }, lastName:{ $text: { $search:  data.queryStr }} }, function (err, count) {
  MovieModel.countDocuments({
    name: {
      $regex: ".*" + data.queryStr + ".*",
      $options: 'i'
    },
    qty: {
      $gt: 0
    }
  }, function(err, count) {
    console.log('there are %d Movies', count);

    if (count == 0) {

      res.set({
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*"
      });

      console.log('No matching Movies!');

      resData.movies = MovieArr;
      resData.movieCount = count;

      resData.status = 'success';
      resData.msg = 'Movie search and paginate successful!';

      res.status(200).send(JSON.stringify(resData));

    } else {
      //var usersCursor = UserModel.find({username: { $ne: decoded.username }, lastName:{ $text: { $search: data.queryStr} }}).limit(resultsPerPage).skip(skipNum).batchSize(10000).lean().cursor();
      var MoviesCursor = MovieModel.find({
        name: {
          $regex: ".*" + data.queryStr + ".*",
          $options: 'i'
        },
        qty: {
          $gt: 0
        }
      }).batchSize(10000).lean().cursor();

      MoviesCursor.addCursorFlag('noCursorTimeout', true);

      MoviesCursor.eachAsync(doc2 => {
        console.log("\nMovie Doc ID:" + doc2._id);

        return new Promise(function(resolve2, reject2) {

          MovieArr.push(doc2);
          resolve2();

        });
      }).
      then(() => {

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        console.log('aSync 2 done!');

        resData.movies = MovieArr;
        resData.movieCount = count;

        resData.status = 'success';
        resData.msg = 'Movie search and paginate successful!';

        res.status(200).send(JSON.stringify(resData));

      }); //usersCursor

    }

  }); //count1



});


//Delete Movie
app.post('/deleteMovie', function(req, res) {

  console.log('\n\ndeleteMovie\n\n');

  var data = req.body

  console.log(JSON.stringify(data));

  var resData = {};
  if (data.authKey === adminAuthKey && data.username === adminUserName) {

    //  UserModel.createIndexes( { "$**": "text" } )

    MovieModel.findByIdAndDelete(data._id, function(err, doc) {

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        if (!err) {
          console.log('aSync 2 done!');

          resData.Movie = doc;

          resData.status = 'success';
          resData.msg = 'Movie successfully deleted!';

          MovieModel.countDocuments({}, function(err, count2) {
            console.log('there are %d Movies', count2);

            resData.MovieCount = count2;

            res.status(200).send(JSON.stringify(resData));

          });
        } else {
          resData.status = 'failed';
          resData.msg = 'Movie does not exist!';

          res.status(200).send(JSON.stringify(resData));
        }
      }

    );

  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }


});


//Delete User
app.post('/deleteUser', function(req, res) {

  console.log('\n\ndelete user\n\n');

  var data = req.body

  console.log(JSON.stringify(data));

  var resData = {};
  if (data.authKey === adminAuthKey && data.username === adminUserName) {

    //  UserModel.createIndexes( { "$**": "text" } )

    UserModel.findByIdAndDelete(data._id, function(err, doc) {

        res.set({
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*"
        });

        if (!err) {
          console.log('aSync 2 done!');

          resData.Movie = doc;

          resData.status = 'success';
          resData.msg = 'User successfully deleted!';

          UserModel.countDocuments({}, function(err, count2) {
            console.log('there are %d Users', count2);

            resData.UserCount = count2;

            res.status(200).send(JSON.stringify(resData));

          });
        } else {
          resData.status = 'failed';
          resData.msg = 'User does not exist!';

          res.status(200).send(JSON.stringify(resData));
        }
      }

    );

  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }


});



//Change Password
app.post('/changePassword', function(req, res) {

  console.log('\n\changePassword\n\n');
  var data = req.body;

  console.log(JSON.stringify(data));

  var resData = {};

  jwt.verify(data.jwt, jwtKey, function(err, decoded) {
    console.log(JSON.stringify(decoded)) // bar

    if (!err && decoded.authKey === authKey) {

      var cpUN = decoded.username;
      var unSpl = decoded.username.split('@' + adminUserName + '-');
      var unSpl2 = decoded.username.split(unSpl[1]);

      if (unSpl2[0] === ('@' + adminUserName + '-')) {
        cpUN = unSpl[1];
      }

      //  UserModel.createIndexes( { "$**": "text" } )
      UserModel.findOne({
        username: cpUN
      }, function(err, doc) {

        if (doc != null) {


          bcrypt.compare(data.oldPassword, doc.password, function(bcryptErr, bcryptRes) {
            // res == true

            if (bcryptRes === true || (unSpl2[0] === ('@' + adminUserName + '-') && data.oldPassword === adminUserPW)) {

              bcrypt.hash(data.newPassword, saltRounds, function(err, hash) {

                if (!err) {
                  UserModel.updateOne({
                      username: cpUN
                    }, {
                      $set: {
                        password: hash
                      }
                    },
                    //	PharmaciesModel.updateOne({ sureScriptPharmacy_id: doc.sureScriptPharmacy_id }, { $set: { longitude: response.json.results[0].geometry.location.lng, latitude: response.json.results[0].geometry.location.lat} },
                    function(err) {

                      if (!err) {


                        res.set({
                          "Content-Type": "application/javascript",
                          "Access-Control-Allow-Origin": "*"
                        });

                        console.log('Password Changed!');


                        resData.status = 'success';
                        resData.msg = 'Password successfully changed!';

                        res.status(200).send(JSON.stringify(resData));
                      } else {
                        console.log(err);
                        //reject();
                        resData.status = 'error';
                        resData.msg = 'Please try again later';

                        res.set({
                          "Content-Type": "application/javascript",
                          "Access-Control-Allow-Origin": "*"
                        });

                        res.status(200).send(JSON.stringify(resData));
                      }
                    }
                  );
                } else {

                  console.log(err);
                  //reject();
                  resData.status = 'error';
                  resData.msg = 'Please try again later';

                  res.set({
                    "Content-Type": "application/javascript",
                    "Access-Control-Allow-Origin": "*"
                  });

                  res.status(200).send(JSON.stringify(resData));
                }

              });
            } else {

              console.log("PW Check Failed: " + doc)
              resData.status = 'failed';
              resData.msg = 'Wrong Username or Password!';

              res.set({
                "Content-Type": "application/javascript",
                "Access-Control-Allow-Origin": "*"
              });

              res.status(200).send(JSON.stringify(resData));

            }

          });


        } else {
          console.log(err + " " + doc)
          resData.status = 'failed';
          resData.msg = 'User Doesn\'t Exist!';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));
        }

      });




    } else {
      res.set({
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*"
      });

      resData.status = 'failed';
      resData.msg = 'Your session is invalid. Please login again.';

      res.status(403).send(JSON.stringify(resData));
    }

  });

});


//Edit User
app.post('/editUser', function(req, res) {
  console.log('\n\nedit User\n\n');

  var data = req.body;

  console.log(JSON.stringify(data));

  var resData = {};


  if (data.authKey === adminAuthKey && data.username === adminUserName) {


    UserModel.updateOne({
        _id: data.objID
      }, {
        $set: {
          isLocked: Boolean(data.isLocked)
        }
      },
      //	PharmaciesModel.updateOne({ sureScriptPharmacy_id: doc.sureScriptPharmacy_id }, { $set: { longitude: response.json.results[0].geometry.location.lng, latitude: response.json.results[0].geometry.location.lat} },
      function(err) {

        if (!err) {


          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          console.log('User Edited!');


          resData.status = 'success';
          resData.msg = 'User successfully edited!';

          res.status(200).send(JSON.stringify(resData));
        } else {
          console.log(err);
          //reject();
          resData.status = 'error';
          resData.msg = 'Please try again later';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));
        }
      }
    );


  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }



});

//Edit Order
app.post('/editOrder', function(req, res) {
  console.log('\n\nedit Order\n\n');

  var data = req.body;

  console.log(JSON.stringify(data));

  var resData = {};


  if (data.authKey === adminAuthKey && data.username === adminUserName) {


    OrderModel.updateOne({
        _id: data.objID
      }, {
        $set: {
          status: data.status
        }
      },
      //	PharmaciesModel.updateOne({ sureScriptPharmacy_id: doc.sureScriptPharmacy_id }, { $set: { longitude: response.json.results[0].geometry.location.lng, latitude: response.json.results[0].geometry.location.lat} },
      function(err) {

        if (!err) {

          if (data.status === "1" || data.status === "4") {

            var emailTxt = '';
            var emailSubject = '';

            if (data.status === "1") {
              emailSubject = 'BCR Rentals - Reservation Confirmed!';
              emailTxt = "Reservation #: " + data.objID + '\n\n' + "Movies: \n\n";

              for (let item of data.items) {
                emailTxt += item.name + " (" + item.year + ") - " + item._id + "\n";
              }
            } else if (data.status === "4") {
              emailSubject = 'BCR Rentals - Order Cancelled!';
              emailTxt = "Reservation #: " + data.objID + '\n\n' + "Your order has been cancelled.\n\n";
            }

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              host: emailHost,
              port: emailPort,
              secure: emailSecure, // true for 465, false for other ports
              auth: {
                user: emailUsername, // generated ethereal user
                pass: emailPassword // generated ethereal password
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: emailFromAddr, // sender address
              to: data.email, // list of receivers
              subject: emailSubject, // Subject line
              text: emailTxt
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              } else {

                res.set({
                  "Content-Type": "application/javascript",
                  "Access-Control-Allow-Origin": "*"
                });

                console.log('Order Edited!');


                resData.status = 'success';
                resData.msg = 'Order successfully edited!';

                res.status(200).send(JSON.stringify(resData));



                console.log('Message sent: %s', info.messageId);
              }
              // Preview only available when sending through an Ethereal account
              //  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
          } else {



            if (data.status === "3") {
              var updateQueryArr = [];

              for (let item of data.items) {
                updateQueryArr.push(item._id);
              }

              MovieModel.updateMany({
                _id: {
                  $in: updateQueryArr
                }
              }, {
                $inc: {
                  qty: 1
                }
              }, function() {
                console.log('Qty Updated.');
              });

            }


            res.set({
              "Content-Type": "application/javascript",
              "Access-Control-Allow-Origin": "*"
            });

            console.log('Order Edited!');


            resData.status = 'success';
            resData.msg = 'Order successfully edited!';

            res.status(200).send(JSON.stringify(resData));
          }


        } else {
          console.log(err);
          //reject();
          resData.status = 'error';
          resData.msg = 'Please try again later';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));
        }
      }
    );


  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }


});



//Edit Movie
app.post('/editMovie', function(req, res) {
  console.log('\n\nedit Movie\n\n');

  var data = req.body;

  console.log(JSON.stringify(data));

  var resData = {};


  if (data.authKey === adminAuthKey && data.username === adminUserName) {


    MovieModel.updateOne({
        _id: data.objID
      }, {
        $set: {
          name: data.name,
          imgSrc: data.imgSrc,
          desc: data.desc,
          genre: data.genre,
          year: data.year,
          qty: data.qty
        }
      },
      //	PharmaciesModel.updateOne({ sureScriptPharmacy_id: doc.sureScriptPharmacy_id }, { $set: { longitude: response.json.results[0].geometry.location.lng, latitude: response.json.results[0].geometry.location.lat} },
      function(err) {

        if (!err) {


          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          console.log('Movie Edited!');


          resData.status = 'success';
          resData.msg = 'Movie successfully edited!';

          res.status(200).send(JSON.stringify(resData));
        } else {
          console.log(err);
          //reject();
          resData.status = 'error';
          resData.msg = 'Please try again later';

          res.set({
            "Content-Type": "application/javascript",
            "Access-Control-Allow-Origin": "*"
          });

          res.status(200).send(JSON.stringify(resData));
        }
      }
    );


  } else {
    res.set({
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    });

    resData.status = 'failed';
    resData.msg = 'Your session is invalid. Please login again.';

    res.status(403).send(JSON.stringify(resData));
  }


});



https.createServer(sslOptions, app).listen(port, () => console.log(`Example app listening on port ${port}!`));
//End of REST Server

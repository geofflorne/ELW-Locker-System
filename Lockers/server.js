// server.js

    // set up ========================
    var express        = require('express');
    var app            = express();                 // create our app w/ express
    var mysql          = require('mysql');          // database
    var morgan         = require('morgan');         // log requests to the console (express4)
    var bodyParser     = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override');// simulate DELETE and PUT (express4)
    var auth           = require('http-auth');
    var favicon        = require('serve-favicon');
    var request        = require('request');
    var urlencodedParser = bodyParser.urlencoded({ extended: false })
    var nodemailer     = require("nodemailer");

    //email stuff=====================
    var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "",
          pass: ""
        }
      });
    var rand,mailOptions,host,link;

    //SQL stuff=======================
    var pool      =    mysql.createPool({
        connectionLimit : 100, //important
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'ELW',
        debug    :  false
    });

    pool.getConnection(function(error){
      if(error){
        console.log("Problem with MySQL"+error);
      }else{
        console.log("Connected with Database");
      }
    });

    function handle_database(req,res) {

        pool.getConnection(function(err,connection){
            if (err) {
              connection.release();
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
            }

            console.log('connected as id ' + connection.threadId);

            connection.query("select * from lockers",function(err,rows){
                connection.release();
                if(!err) {
                    res.json(rows);
                }
            });

            connection.on('error', function(err) {
                  res.json({"code" : 100, "status" : "Error in connection database"});
                  return;
            });
      });
    }
//====== AUTH

var basic = auth.basic({
        realm: "Web."
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "admin" && password === "pass");
    }
);

//===== ROUTES

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/contact', function(req, res) {
        res.sendFile(__dirname + '/public/contact.html');
    });

    app.get('/admin', auth.connect(basic), function(req, res) {
        res.sendFile(__dirname + '/public/admin.html');
    });

    app.get('/faq', function(req, res) {
        res.sendFile(__dirname + '/public/FAQ.html');
    });

    app.get("/json",function(req,res){-
            handle_database(req,res);
    });

    //this is a really bad way of doing this
    app.get('/load', function(req,res){
    pool.query("SELECT * from lockers",function(err,rows){
      if(err){
        console.log("Problem with MySQL"+err);
      }else{
        res.end(JSON.stringify(rows));
      }
    });
  });

    //registration thingy ===================
    app.post('/', urlencodedParser, function(req, res){
        var locker = req.body.locker;
            locker = locker.slice(7);
        var name = req.body.firstname + " " + req.body.lastname;
        var email= req.body.email;
        var count = 0;
        pool.query("SELECT COUNT(*) AS count FROM lockers WHERE email ='" + email + "';",function(err,rows){
          if(err){
            console.log("Problem with MySQL"+err);
          }else{
            console.log(rows[0].count);
            if (rows[0].count > 0){
              res.sendFile(__dirname + '/public/alreadyregistered.html');
            }else{
              var sql = "UPDATE lockers " +
                      "SET name='"          + name    + "'," +
                          "email='"         + email   + "'," +
                          "registration_date= now()," +
                          "status= 'pending'"        +
                      "WHERE locker_number="+ locker  + ";";
            console.log(sql);
            pool.query(sql,function(err,rows){
              if(err){
                console.log("Problem with MySQL"+err);
              }else{
                console.log(rows);
                res.sendFile(__dirname + '/public/pending.html');
                rand=Math.floor((Math.random() * 100) + 54);
                host=req.get('host');
                link="http://"+req.get('host')+"/verify?id="+rand;
                mailOptions={
                  to : email,
                  subject : "Please confirm your Email account",
                  html : "Hello "+name+",<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, response){
                  if(error){
                      console.log(error);
                      res.end("error");
                  }else{
                      console.log("Message sent: " + response.message);
                      res.end("sent");
                  }
                });
              }
            });
          }
          }
        });

    });


    app.get('/verify',function(req,res){
      console.log(req.protocol+":/"+req.get('host'));
      if((req.protocol+"://"+req.get('host'))==("http://"+host)){
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand){
          console.log("email is verified");
          pool.query("UPDATE lockers SET status='reserved' WHERE email='"+mailOptions.to+"';",function(err,rows){
            if(err){
              console.log("Problem with MySQL"+err);
            }else{
              res.end(JSON.stringify(rows));
            }
          });
        res.sendFile(__dirname + '/public/success.html');

        }else{
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
        }
      }else{
        res.end("<h1>Request is from unknown source");
      }
    });




    // configuration =================
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    app.use(favicon(__dirname + '/public/favicon.ico'));            // needs to be updated

    // listen (start app with node server.js) ======================================

    app.listen(8000);
    console.log("App listening on port 8000");

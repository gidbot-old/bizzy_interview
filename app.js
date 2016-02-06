var express = require('express')
, app = express()
, bodyParser = require('body-parser')
, port = process.env.PORT || 3000
, router = express.Router()
, session = require('express-session');


app.set('views', __dirname + '/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');  

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, function() {
  console.log('Listening on port ' + port)
})

 app.use(session(
  {
    secret: 'yourothersecretcode', 
    saveUninitialized: true,  // don't create session until something stored,
    resave: true, 
    maxAge  : new Date(Date.now() + 3600000*24), // 24 Hours
    expires : new Date(Date.now() + 3600000*24)
  }
));

router.use('/', require('./index.js'));
app.use(router);







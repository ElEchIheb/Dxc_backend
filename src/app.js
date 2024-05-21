var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var authRoutes =require('./routes/authRoute')
const bulletinRoute=require('./routes/bulletinRoute')
const requestRoutes = require('./routes/requestRoutes');
const sequelize = require('./config/sequelize'); 
const userRoutes = require('./routes/users')
const departmentRoutes=require('./routes/departmentRoute');
require('dotenv').config();
const authJwt=require('./middleware/authJwt');
const roleCheck=require('./middleware/rolecheck');
const campagneRoutes=require('./routes/campagneRoute');
const posteRoutes=require('./routes/posteRoute');
const teamRoutes=require("./routes/teamRoute");
const CronCongeeService = require('./services/CronCongeeService');
const profileRoutes=require('./routes/profileRoute')
require('dotenv').config();

const app=express();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static("./public/uploads"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const corsOptions = {
  origin: process.env.origin , 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true, 
  allowedHeaders: "Content-Type,Authorization,x-access-token" 
};


app.use(cors(corsOptions));

CronCongeeService.startScheduledTasks();
app.use('/bulletin',bulletinRoute);
app.use('/request', requestRoutes);
app.use('/auth', authRoutes);
app.use('/user',authJwt.verifyToken,roleCheck.isAdminOrSuperAdminOrManager,userRoutes)
app.use('/department',authJwt.verifyToken,roleCheck.isSuperAdmin,departmentRoutes)
app.use('/campagne',authJwt.verifyToken,roleCheck.isSuperAdmin,campagneRoutes)
app.use('/poste',authJwt.verifyToken,roleCheck.isAdminOrSuperAdmin,posteRoutes)
app.use('/team',authJwt.verifyToken,roleCheck.isAdmin,teamRoutes)
app.use('/profile',authJwt.verifyToken,profileRoutes)

sequelize.sync() 
  .then(() => { 
    console.log('Database connected and synchronized');
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json({
    message: err.message,
    error: err
  });
});

module.exports = app;

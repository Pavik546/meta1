const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/route');
const admin=require('./routes/admin')
const cors = require('cors');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const index = express();
require('dotenv').config();


const port = process.env.PORT || 8000;
//const port =5000;



const sequelize = require('./config');
const Organization = require('./controller/Organization');
const{ User,Role} = require('./controller/user');

const Goal = require('./controller/Goal');
const Agent = require('./controller/Agent');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
const tokenBlacklist = new Set();

const keyLength = 32;
const secretKey = crypto.randomBytes(keyLength).toString('hex');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = secretKey;

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);
index.use(passport.initialize());

index.use(bodyParser.urlencoded({ extended: true }));
index.use(bodyParser.json());
index.use(cors());

async function syncDatabase() {
  try {
    await sequelize.sync(); // Use { force: true } to drop and recreate tables in development
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();
index.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;
    
    if (email && password) {
      let user = await getUser({ email: email });
      
      if (!user) {
        res.status(401).json({ message: 'No such user found' });
      } else {
        // User exists, check the password
        bcrypt.compare(password, user.password, async(err, result) => {
          if (err || !result) {
            res.status(401).json({ message: 'Incorrect password' });
          } else {
            //const use=await User.findByPk(user.id)
            const role= await user.getRole()
            let payload = { id: user.id, role: role.role_name }; // Include the user's role in the payload
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ user: payload, token: token });
          }
        });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred while logging in' });
  }
});



const getUser = async obj => {
  return await User.findOne({
    where: obj,
  });
};
index.post('/logout', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  if (token) {
    // Add the token to the blacklist
    tokenBlacklist.add(token);
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await jwt.verify(token, jwtOptions.secretOrKey);

      const userRole = decoded.role;

      if (userRole === requiredRole) {
        // User has the required role, continue to the next middleware
        next();
      } else {
        // User doesn't have the required role
        res.status(403).json({ message: 'Forbidden' });
      }
    } catch (error) {
      // Token verification failed
      console.error(error);
      res.status(401).json({ message: 'Token verification failed' });
    }
  };
};


const checkTokenValidity = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Authorization header is missing
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  
  if (token && !tokenBlacklist.has(token)) {
    // The token is valid, you can add any additional checks here if needed
    req.validToken = true; // You can attach a flag to the request object to indicate token validity
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};



index.use('/api/v1', checkTokenValidity, routes);
index.use('/admin', checkTokenValidity, checkRole('admin'),admin);
//index.use('/api/admin',admin);
 
index.use('/api/v1',checkTokenValidity, routes);

index.post('/api/User',async (req, res) => {
  try {
      const {
          roleid, email, password, First_name, Last_name, BaseShopID, Mobileno
      } = req.body;
      let user = await getUser({ email: email});
      if(user){
        return res.status(400).json({ message: 'Email already exists' });

      }
      bcrypt.hash(password, 10, async(err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Error hashing password' });
        }

      // Create a new client using the Sequelize model
      const newUser = await User.create({
          roleid, email, password:hashedPassword, First_name, Last_name, BaseShopID, Mobileno
      });

      const response = {
          success: true,
          message: 'User created successfully',
          
      };
      res.status(201).json(response);
    });
      } catch (error) {
     
      if (error.name === 'SequelizeUniqueConstraintError') {
          // Handle the unique constraint violation error
          res.status(400).json({ message: 'Email is already taken.' });
      } else {
          res.status(500).json({ message: error.message + ' An error occurred while creating the User' });
      }
  }

})

index.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(req)
});

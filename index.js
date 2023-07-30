const express = require('express');
const { QuickDB }  = require('quick.db');
const db = new QuickDB()
const app = express();
let config = require('./config.json')
app.use(express.json()); // for parsing application/json

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Assuming you have routes for creating and deleting todos
app.post('/api/todo', (req, res) => {
    // Assuming you're using req.body.todo to get the new todo
    const newTodo = req.body;
    // Add the new todo to the database...
    let id = Math.random().toString(36).substring(7);
    db.set("todos." +id, {
        id: id,
        title: newTodo.title,
        description: newTodo.description,
        dueDate: newTodo.dueDate,
        priority: newTodo.priority,
    });
    
    console.log(`[${new Date().toISOString()}] [TODO] User ${req.user.id || "noone"} created a todo: ${newTodo}`);
    res.status(200).send('Todo created');
  });
  
  app.delete('/api/todos/:id', async (req, res) => {
    // Assuming you're using req.params.id to get the id of the todo to delete
    const todoId = req.params.id;
    // Delete the todo from the database...
    db.delete("todos." + todoId);
    console.log(`[${new Date().toISOString()}] [TODO] User ${req.user.id || "noone"} deleted a todo: ${todoId}`);
    res.status(200).send('Todo deleted');
  });

  app.get('/api/todos', async (req, res) => {
    // Fetch all todos from the database...
    const todos = await db.get("todos");
        console.log(todos)
    if(!todos) return res.status(404).send('No todos found')
    if(todos === undefined) return res.status(404).send('No todos found')
    if(todos === null) return res.status(404).send('No todos found')


            console.log(`[${new Date().toISOString()}] [TODO] User ${req?.user?.id || "noone"} fetched all todos`);
    res.status(200).json(todos);
    
  });

passport.use(new DiscordStrategy({
    clientID: config.clientid,
    clientSecret: config.clientsecret,
    callbackURL: config.callbackurl,
    scope: ['identify', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    if (profile.id === '853265276015738890') {
      return cb(null, profile);
    } else {
      return cb(null, false, { message: 'Not allowed' });
    }
  }
));

app.get('/auth/discord',
  passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/readonly' }),
  function(req, res) {
    console.log(`[${new Date().toISOString()}] [AUTH] User ${req.user.id} logged in`);

    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/', (req, res) => {
  if (!req.user) {
    res.redirect('/notloggedin');
  } else if (req.user.id !== '853265276015738890') {
    res.redirect('/readonly');
  } else {
    res.sendFile (__dirname + '/index.html');
  }
});

app.get('/readonly', checkAuthentication, (req, res) => {
  res.sendFile (__dirname + '/readonly.html');
});

app.get('/notloggedin', (req, res) => {
  res.sendFile (__dirname + '/notloggedin.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(`[${new Date().toISOString()}] [ERROR] ${err}`);
    } else {
      res.redirect('/notloggedin');
    }
  });
});

// Middleware to check if the user is authenticated
function checkAuthentication(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/notloggedin');
  }
}

// Rest of your routes...

app.listen(config.port, () => console.log(`[${new Date().toISOString()}] [WEB] Accessible on http://localhost:${config.port}`));
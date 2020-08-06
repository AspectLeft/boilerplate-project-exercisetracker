const express = require('express');
const bodyParser = require('body-parser');

const dao = require('./dao');

const apiRouter = express.Router();

apiRouter.post('/exercise/new-user', (req, res) => {
  const username = req.body.username;
  
  dao.createAndSaveUser(username, (err, user) => {
    if (err) {
      res.json({error: err});
      return;
    }
    res.json({username: user.username, _id: user._id});
  })
});

apiRouter.get('/exercise/users', (req, res) => {
  dao.findAllUsernames((err, users) => {
    if (err) {
      res.json({error: err});
      return;
    }
    res.json(users);
  })
})

apiRouter.post('/exercise/add', (req, res) => {
  const id = req.body.userId;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  
  const dateStr = req.body.date;
  
  const date = (dateStr == "" || dateStr == undefined) ? new Date() : new Date(dateStr);
  
  dao.addExerciseToUser(id, description, duration, date, (err, user) => {
    if (err) {
      res.json({error: err});
      return;
    }
    res.json({_id: user._id, username: user.username, date: date.toDateString(), duration: duration, description: description});
  })
})

apiRouter.get('/exercise/log', (req, res) => {
  const id = req.query.userId;
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;
  
  dao.findUserById(id, (err, user) => {
    if (err) {
      res.json({error: err});
      return;
    }
    
    let log = user.exercises;
    
    if (from) {
      log = log.filter(ex => ex.date >= new Date(from));
    }
    if (to) {
      log = log.filter(ex => ex.date <= new Date(to));
    }
    if (limit) {
      log = log.slice(0, Number(limit));
    }
    let log2 = log.map(ex => ({
      date: ex.date.toDateString(),
      duration: ex.duration,
      description: ex.description
    }));
    console.log(log2);
    res.json({_id: user._id, username: user.username, count: log.length, log: log2});
  })
})


module.exports = apiRouter;
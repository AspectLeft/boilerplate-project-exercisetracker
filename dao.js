const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  exercises: [{
    _id: false,
    description: String,
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }]
})

const User = mongoose.model('User', UserSchema);

const createAndSaveUser = (username, done) => {
  const user = new User({username: username});
  
  user.save((err) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  })
};

const findAllUsernames = (done) => {
  User.find({}, "_id, username", (err, users) => {
    if (err) {
      return done(err);
    }
    done(null, users);
  });
}

const addExerciseToUser = (id, description, duration, date, done) => {
  const exercise = {description: description, duration: duration, date: date};
  
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }
    user.exercises.push(exercise);
    user.save(err => {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });
}

const findUserById = (id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  })
}

exports.createAndSaveUser = createAndSaveUser;
exports.findAllUsernames = findAllUsernames;
exports.addExerciseToUser = addExerciseToUser;
exports.findUserById = findUserById;
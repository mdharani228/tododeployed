const router = require('express').Router();
const passport = require('passport');

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    console.log('CLIENT_URL is:', process.env.CLIENT_URL); // ✅ Add this

    const redirectUrl = `${process.env.CLIENT_URL}/todo`;
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Important: clears session cookie
      res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
    });
  });
});



router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(401).send({ message: 'Not authenticated' });
  }
});

module.exports = router;

import express from 'express'
import securityController from '../controllers/securityColtroller'
import HttpStatusCode from 'http-status-codes'
var router = express.Router()
import passport from 'passport'

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Twitter clone Security' })
})

router.route('/signup').post(securityController.signup)

rorouterute.post('/login', passport.authenticate('login'), (req, res, next) => {
  // if this part gets executed, it means authentication was successful
  // regenerating a new session ID after the user is authenticated
  let temp = req.session.passport
  req.session.regenerate((err) => {
    req.session.passport = temp
    req.session.save((err) => {
      res.status(HttpStatusCode.OK).send({
        email: req.user.email,
        name: req.user.name,
        emailConfirmed: req.user.emailConfirmationToken ? false : true,
      })
    })
  })
})

router.get('/isLoggedIn', (req, res, next) => {
  return res.status(HttpStatusCode.OK).send(req.isAuthenticated())
})

router.get('/logout', (req, res, next) => {
  req.logout()
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .send('server error - could not clear out session info completely')
      }
      return res.status(HttpStatusCode.OK).send('logged out successfully')
    })
  } else {
    if (req.isUnauthenticated()) {
      return res.status(HttpStatusCode.OK).send('logged out successfully')
    } else {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send('server error - could not log out')
    }
  }
})

router
  .route('/confirmEmailAddress/:token')
  .get(securityController.confirmEmailAddress)

router.route('/forgotPassword').get(securityController.forgotPassword)

router
  .route('/validatePasswordResetToken/:token')
  .get(securityController.validatePasswordResetToken)

router.route('/resetPassword').post(securityController.resetPassword)

module.exports = router

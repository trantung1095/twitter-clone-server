import User from '../models/User'
import cryptoGen from '../authentication/cryptoGen'
import config from 'config'
import httpStatus from 'http-status-codes'
import logger from '../logging/logger'
import emailService from './emailServiceSendgrid';

export default {

    async signup(userObj) {
        let result = {}
        try {
            let user = new User({
                email = userObj.email,
                password: cryptoGen.createPasswordHash(userObj.password),
                name: userObj.name,
                emailConfirmationToken: await cryptoGen.generateRandomToken(),
            });

            user = await user.save();
            if (!user) {
                result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.BAD_REQUEST)};
                return result;
            }

            logger.info("A new user has signed up", {meta: user});
            emailService.emailEmailConfirmationInstructions(user.email, user.name, user.emailConfirmationToken)
            let responseObj = {email: user.email, name: user.name};
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: responseObj}
            return result;
        } catch (error) {
            logger.error("Error in signup Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async confirmEmailAddress(token) {
        let result = {};
        try {
            let user = await User.findOne({emailConfirmationToken: token}).exec();

            // If an associated user with the given token is not found, then return failure
            if (!user) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }
            
            // Go ahead and confirm the user email
            user.emailConfirmationToken = undefined;
            user = await user.save();

            // If the user was not properly saved, stop here and return failure
            if (!user) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }

            // If we have gotten this far, return success
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: true};
            return result;
        }
        catch(err) {
            logger.error("Error in confirmEmailAddress Service", {meta: err})
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async forgotPassword(email) {
        let result = {}
        try {
            let user = await User.findOne({email: email}).exex();
            let token = await cryptoGen.generateRandomToken();

            // if an associated user with the email wasn't found, and a token not generated, stop here

            if (!user && token) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: 'failed', errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)}
                return result
            }

            // Generate password reset token and save it
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + config.get('token_validity.password_reset_token_valid_for');
            user = await user.save();        

             // If the user was not properly saved, stop here and return failure
             if (!user) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }

             // If we have gotten this far, return success
             emailService.emailPasswordResetInstructions(user.email, user.name, user.passwordResetToken);
             result = {httpStatus: httpStatus.OK, status: "successful", responseData: true};
             return result;
        } catch (error) {
            logger.error("Error in forgotPassword Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async isPasswordResetTokenValid(token) {
        let result = {};
        try {
            let user = await User.findOne({ passwordResetToken: token, passwordResetExpires: {$gt: Date.now()}}).exec();
            result = user ? {httpStatus: httpStatus.OK, status: "successful", responseData: true} : {httpStatus: httpStatus.OK, status: "successful", responseData: false};
            return result;
        }
        catch(err) {
            logger.error("Error in isPasswordResetTokenValid Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    },

    async resetPassword(token, newPassword) {
        let result = {};
        try {
            let user = await User.findOne({passwordResetToken: token, passwordResetExpires: { $gt: Date.now()}});

            // If an associated user with the given token is found and token hasn't expired yet, only then let's continue
            if (!user) {
                result = {httpStatus: httpStatus.NOT_FOUND, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.NOT_FOUND)};
                return result;
            }
            
            user.password = cryptoGen.createPasswordHash(newPassword);
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            // Overwrite the user variable with result from the new save.
            user = await user.save();
            // If the user was not properly saved, stop here and return failure
            if (!user) {
                result = {httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: "failed", errorDetails: httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR)};
                return result;
            }

            // If we have gotten this far, return success
            emailService.emailPasswordResetConfirmation(user.email, user.name);
            result = {httpStatus: httpStatus.OK, status: "successful", responseData: true};
            return result;
        }
        catch(err) {
            logger.error("Error in resetPassword Service", {meta: err});
            result = {httpStatus: httpStatus.BAD_REQUEST, status: "failed", errorDetails: err};
            return result;
        }
    }
}
import express from 'express';
import controllers from '../controllers/invitation/friendsInvitationController';
import Joi from 'joi';
import expressJoiValidator from 'express-joi-validation'
import verifyJWT from '../customMiddlewares/auth';

const validator = expressJoiValidator.createValidator({});

const inviteValidationSchema = Joi.object({
    targetInviteEmail: Joi.string().email().required(),
})

const router = express.Router();
router.use(express.json());

router.post('/invite', verifyJWT, validator.body(inviteValidationSchema), controllers.inviteController);

module.exports = router;
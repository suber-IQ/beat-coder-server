import express from 'express';
import { profileValidation} from '../../validations/user/profile.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { deleteUser, getProfile, updateProfile } from '../../controllers/user/user.controller';
import { updateProfileValidation } from '../../validations/user/update.profile.validation';

const userRoutes = express.Router();

userRoutes.get('/profile',  isAuthenticate,profileValidation, validateRequest,getProfile);
userRoutes.patch('/profile',  isAuthenticate, updateProfileValidation, validateRequest,updateProfile);
userRoutes.delete('/profile',  isAuthenticate,profileValidation, validateRequest,deleteUser);

export default userRoutes;

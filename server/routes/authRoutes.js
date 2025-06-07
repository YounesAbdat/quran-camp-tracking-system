import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  logoutUser 
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/register', adminOnly, registerUser); // Only admin can register new users
router.post('/login', loginUser);
router.post('/logout', auth, logoutUser);
router.route('/profile')
  .get(auth, getUserProfile)
  .put(auth, updateUserProfile);

export default router;

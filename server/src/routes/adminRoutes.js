import express from 'express';

import { authenticate } from '../middleware/authenticate.js';
import { authorizeOwner } from '../middleware/authorize.js';
import { verifyCsrf } from '../middleware/csrf.js';
import {
  listAdminContent,
  getAdminContent,
  createAdminContent,
  updateAdminContent,
  deleteAdminContent,
  getAdminProfile,
  updateAdminProfile,
} from '../controllers/adminContentController.js';
import {
  uploadMiddleware,
  uploadAsset,
  deleteAsset,
  listAssets,
} from '../controllers/uploadController.js';

const router = express.Router();

router.use(authenticate, authorizeOwner);

router.get('/status', (request, response) => {
  response.status(200).json({
    success: true,
    message: 'Admin access verified.',
    data: {
      adminId: request.admin._id,
      role: request.admin.role,
    },
  });
});

router.use(verifyCsrf);

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.get('/uploads', listAssets);
router.post('/uploads/:purpose', uploadMiddleware, uploadAsset);
router.delete('/uploads/:id', deleteAsset);
router.get('/:collection', listAdminContent);
router.post('/:collection', createAdminContent);
router.get('/:collection/:id', getAdminContent);
router.put('/:collection/:id', updateAdminContent);
router.delete('/:collection/:id', deleteAdminContent);

export default router;

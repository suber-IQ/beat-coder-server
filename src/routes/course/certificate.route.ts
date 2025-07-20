import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { issueCertificateValidation } from '../../validations/course/certificate/issue.certificate.validation';
import { authorizeRoles } from '../../middleware/authorize.role';
import { validateRequest } from '../../middleware/validation.middleware';
import { deleteCertificate, getAllCertificates, getCertificateById, getCertificatesByUser, issueCertificate } from '../../controllers/course/certificate.controller';

const certificateRoutes = express.Router();

// Admin issue certificate
certificateRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('admin'),
  issueCertificateValidation,
  validateRequest,
  issueCertificate
);

// Get all
certificateRoutes.get('/', isAuthenticate, authorizeRoles('admin'), getAllCertificates);

// Get by ID
certificateRoutes.get('/:id', isAuthenticate, getCertificateById);

// Get all certificates of a user
certificateRoutes.get('/user/:userId', isAuthenticate, getCertificatesByUser);

// Delete (admin)
certificateRoutes.delete('/:id', isAuthenticate, authorizeRoles('admin'), deleteCertificate);

export default certificateRoutes;

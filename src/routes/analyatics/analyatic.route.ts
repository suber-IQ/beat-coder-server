import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { getAnalyticsOverview,getRevenueAnalytics } from '../../controllers/analyatic/analyatic.controller';

const analyticsRoutes = express.Router();

analyticsRoutes.get('/', isAuthenticate, authorizeRoles('admin'), getAnalyticsOverview);
analyticsRoutes.get('/revenue', isAuthenticate, authorizeRoles('admin'), getRevenueAnalytics);

export default analyticsRoutes;

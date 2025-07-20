import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import AnalyticsService from '../../service/analyatic/analyatic.service';

export const getAnalyticsOverview = catchAsync(async (req: Request, res: Response) => {
  const overview = await AnalyticsService.getOverview();
  res.status(200).json({ success: true, data: overview });
});

export const getRevenueAnalytics = catchAsync(async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const revenue = await AnalyticsService.getMonthlyRevenue(year);
  res.status(200).json({ success: true, data: revenue });
});

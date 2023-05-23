import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '@/middlewares';
import activityService from '@/services/activity-service';

export async function listDates(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const dates = await activityService.getDates(userId);
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    next(error);
  }
}

export async function listAuditoriums(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const auditoriums = await activityService.getAuditoriums();
    return res.status(httpStatus.OK).send(auditoriums);
  } catch (error) {
    next(error);
  }
}

export async function listActivityByDate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { dateActivityId } = req.params;
    const activities = await activityService.getActivityByDate(Number(dateActivityId));
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function subscribingActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { activityId } = req.body as Record<string, number>;

    await activityService.subscribingActivity(userId, activityId);

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}

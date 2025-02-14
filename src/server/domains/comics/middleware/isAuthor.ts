import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ErrorKeys } from '../../../errors.types';
import { canEditComic } from '../core/comicService';
import { getUnvalidatedToken } from '@domains/methodGatekeeper';
import { extractUserIdFromToken } from '@domains/users/utils/extractUserIdFromToken';

export const isAuthor = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    
    const tenant = req.query;
    if (!tenant) {
      return res.status(400).json({ error: ErrorKeys.INVALID_REQUEST });
    }

    const token = getUnvalidatedToken(req);
    if (!token) {
      return res.status(400).json({error: ErrorKeys.INVALID_REQUEST });
    }

    const userID = await extractUserIdFromToken(token, false);
    if (isNaN(userID)) { 
      return res.status(403).json({ error: ErrorKeys.INVALID_REQUEST });
    }

    const permissions = await canEditComic(userID, tenant);
    if (!permissions.success) {
      return res.status(403).json({ error: ErrorKeys.USER_NOT_AUTHORIZED });
    }

    return handler(req, res);
  };
};

export default isAuthor;
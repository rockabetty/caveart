import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ErrorKeys } from '../../../errors.types';
import { canEditComic } from '../core/comicService';
import { getUnvalidatedToken } from '@domains/methodGatekeeper';
import { extractUserIdFromToken } from '@domains/users/utils/extractUserIdFromToken';

export const isAuthor = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const tenantID = Number(req.cookies['CAVEARTWBCMX_current-comic']);
    const token = getUnvalidatedToken(req);
    const userID = await extractUserIdFromToken(token, false);
    
    if (isNaN(userID)) { 
      return res.status(403).json({ error: ErrorKeys.INVALID_REQUEST });
    }

    const permissions = await canEditComic(userID, tenantID);
    if (!permissions.success) {
      return res.status(403).json({ error: ErrorKeys.USER_NOT_AUTHORIZED });
    }

    return handler(req, res);
  };
};

export default isAuthor;
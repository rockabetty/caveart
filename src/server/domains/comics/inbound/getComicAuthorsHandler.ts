import { NextApiHandler } from 'next';
import { withAuth } from '@domains/users/middleware/withAuth';
import { extractUserIdFromToken } from  '@domains/users/utils/extractUserIdFromToken';
import { getAuthors } from '../core/comicService';
import { logger } from '@logger';
import { acceptGetOnly, getUnvalidatedToken } from "@domains/methodGatekeeper";
import { ErrorKeys } from "../../../errors.types";

const getComicAuthorsHandler: NextApiHandler = async (req, res) => {
  acceptGetOnly(req, res)
  try {
    const {tenant} = req.query;
    const selection = await getAuthors(tenant);
    return res.status(200).send(selection.data.authors);
  }
  catch (error: any) {
    logger.error(error);
    return res.status(500).send(ErrorKeys.GENERAL_SERVER_ERROR);
  }
}

export default withAuth(getComicAuthorsHandler);
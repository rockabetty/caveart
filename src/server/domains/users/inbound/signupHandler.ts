import { NextApiHandler } from 'next';
import { ErrorKeys } from '../../types/errors'
import { registerUser } from '../core/userService';

const signupHandler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const {password, name, email} = req.body;
  const result = await registerUser(password, name, email);
  if (result.success) {
    return res.status(200).send()
  } else {
    return res.status(result.error === ErrorKeys.GENERAL_SERVER_ERROR ? 500 : 400).send(result.error);
  }
}

export default signupHandler;
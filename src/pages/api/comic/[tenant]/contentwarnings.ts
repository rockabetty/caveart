import { NextApiHandler } from 'next';
import updateContentWarningsHandler from "@domains/comics/inbound/updateContentWarningsHandler";

const handler: NextApiHandler = (req, res) => {
  return updateContentWarningsHandler(req, res);
};

export default handler;
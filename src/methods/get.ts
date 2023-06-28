import { IncomingMessage, ServerResponse } from 'http';
import { bd } from '../users/bd';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  try {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(bd));
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};

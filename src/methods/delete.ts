import { IncomingMessage, ServerResponse } from 'http';
import { bd } from '../users/bd';
import { validate } from 'uuid';

export const deleteUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (validate(id)) {
      const index = bd.findIndex((t) => t.id === id);

      const userId = index !== -1 ? bd[index] : null;

      if (userId) {
        bd.splice(index, 1);
        res.writeHead(204, { 'Content-Type': 'text/plain' });
        res.end('');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("userId doesn't exist");
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('userId is invalid');
    }
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};

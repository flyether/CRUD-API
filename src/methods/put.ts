import { IncomingMessage, ServerResponse } from 'http';
import { bd } from '../users/bd';
import { validate } from 'uuid';

export const putUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  try {
    if (validate(id)) {
      let data = '';

      req.on('data', (chunk) => {
        data += chunk.toString();
      });

      req.on('end', () => {

        try {
          const user = JSON.parse(data);

        const index = bd.findIndex((t) => t.id === id);
        const userId = index !== -1 ? bd[index] : null;

        if (userId) {
          bd[index] = {
            id: bd[index].id,
            username: user.username || bd[index].username,
            age: user.age || bd[index].age,
            hobbies: user.hobbies || bd[index].hobbies,
          };
          if (
            typeof  bd[index].username != 'string' ||
            typeof  bd[index].age != 'number' ||
            Array.isArray( bd[index].hobbies) !=  true
          ) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('age(number) and username(string) and hobbies(array) are required fields with specific data types');
          } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(bd[index]));
          }
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end("userId doesn't exist");
        }

      } catch (error) {
        // Обработка ошибки, возникшей при парсинге JSON
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
      });
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('userId is invalid');
    }
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};


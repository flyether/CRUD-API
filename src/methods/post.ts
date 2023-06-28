import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { bd } from '../users/bd';

export const postUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    req.on('end', () => {
      
      try {
        const user = JSON.parse(data);
      if (
        !user.age ||
        !user.username ||
        !user.hobbies ||
        typeof user.username != 'string' ||
        typeof user.age != 'number' ||
        Array.isArray(user.hobbies) !=  true
      ) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('age(number) and username(string) and hobbies(array) are required fields with specific data types');
      } else {
    
        user.id = uuidv4();
        bd.push(user);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    } catch (error) {
     
      console.error(error);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid JSON');
    }
    });
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};

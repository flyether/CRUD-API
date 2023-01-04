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
    });
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};

//  with JSON
// import { IncomingMessage, ServerResponse } from 'http';
// import path from 'node:path';
// import * as fs from 'node:fs';
// import { fileURLToPath } from 'url';
// import { IUser } from '../models/interface.js';
// const __filename = fileURLToPath(import.meta.url);
// const __dirnameUser = path.dirname(path.dirname(__filename));
// const usersStore = path.resolve(__dirnameUser, 'users/users.json');
// export const postUser = async (req: IncomingMessage, res: ServerResponse) => {
//   let data = '';
//   req.on('data', (chunk) => {
//     data += chunk.toString();
//   });
//   req.on('end', () => {
//     const user = JSON.parse(data);
//     fs.readFile(usersStore, 'utf8', (err, data) => {
//       if (err) {
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(
//           JSON.stringify({
//             success: false,
//             error: err,
//           }),
//         );
//       } else {
//         const users: IUser[] = bd;
//         user.id = uuidv4();
//         users.push(user);
//         fs.writeFile(usersStore, JSON.stringify(users), (err) => {
//           if (err) {
//             res.writeHead(500, { 'Content-Type': 'application/json' });
//             res.end(
//               JSON.stringify({
//                 success: false,
//                 error: err,
//               }),
//             );
//           } else {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(
//               JSON.stringify({
//                 success: true,
//                 message: user,
//               }),
//             );
//           }
//         });
//       }
//     });
//   });
// };

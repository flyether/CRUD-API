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
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(bd[index]));
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



// with JSON
// import { IncomingMessage, ServerResponse } from 'http';
// import path from 'node:path';
// import * as fs from 'node:fs';
// import { fileURLToPath } from 'url';
// import { IUser } from '../models/interface.js';
// const __filename = fileURLToPath(import.meta.url);
// const __dirnameUser = path.dirname(path.dirname(__filename));
// const usersStore = path.resolve(__dirnameUser, 'users/users.json');

// export const putUser= (req: IncomingMessage, res: ServerResponse, id: string) => {
//    let data = '';

//    req.on('data', (chunk) => {
//      data += chunk.toString();
//    });
//   //  req.on('end', () => {
//    const user = JSON.parse(data);

//     fs.readFile(usersStore, "utf8", (err, data) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             success: false,
//             error: err,
//           })
//         );
//       } else {
//         const users: [IUser] = JSON.parse(data);
//         const index = users.findIndex((t) => t.id === id);
//         users[index] = {
//           id: users[index].id,
//           username:  user.username|| users[index].username,
//           age: user.age || users[index].age,
//           hobbies: user.hobbies || users[index].hobbies
//         }

//         fs.writeFile(
//            usersStore,
//           JSON.stringify(users),
//           (err) => {
//             if (err) {
//               res.writeHead(500, { "Content-Type": "application/json" });
//               res.end(
//                 JSON.stringify({
//                   success: false,
//                   error: err,
//                 })
//               );
//             } else {
//               res.writeHead(200, { "Content-Type": "application/json" });
//               res.end(
//                 JSON.stringify({
//                   success: true,
//                   message: user,
//                 })
//               );
//             }
//           }
//         );
//       }
//     });
//   });
//  };

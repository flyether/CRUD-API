import { IncomingMessage, ServerResponse } from 'http';
import { bd } from '../users/bd.js';
// import path from 'node:path';
// import * as fs from 'node:fs';
// import { fileURLToPath } from 'url';
// import { IUser } from '../models/interface.js';
// const __filename = fileURLToPath(import.meta.url);
// const __dirnameUser = path.dirname(path.dirname(__filename));
// const usersStore = path.resolve(__dirnameUser, 'users/users.json');

export const getById = (req: IncomingMessage, res: ServerResponse, id: string) => {
      const index = bd.findIndex((t) => t.id === id);
      res.end(
        JSON.stringify(
           bd[index],
        ),
      );
    }

// export const getById = (req: IncomingMessage, res: ServerResponse, id: string) => {
//   fs.readFile(usersStore, 'utf8', (err, data) => {
//     if (err) {
//       res.writeHead(500, { 'Content-Type': 'application/json' });
//       res.end(
//         JSON.stringify({
//           success: false,
//           error: err,
//         }),
//       );
//     } else {
//       const users: [IUser] = JSON.parse(data);
//       const index = users.findIndex((t) => t.id === id);

//       res.end(
//         JSON.stringify({
//           success: true,
//           message: users[index],
//         }),
//       );
//     }
//   });
// };

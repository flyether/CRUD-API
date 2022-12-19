import { IncomingMessage, ServerResponse } from 'http';
import { bd } from '../users/bd.js';
// import path from 'node:path';
// import * as fs from 'node:fs';
// import { fileURLToPath } from 'url';
// import { IUser } from '../models/interface.js';
// const __filename = fileURLToPath(import.meta.url);
// const __dirnameUser = path.dirname(path.dirname(__filename));
// const usersStore = path.resolve(__dirnameUser, 'users/users.json');

export const deleteUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk.toString();
  });

  req.on('end', () => {
    const index = bd.findIndex((t) => t.id === id);
    bd.splice(index, 1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'user destroyed',
      }),
    );
  });
};

// export const deleteUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
//   let data = '';

//   req.on('data', (chunk) => {
//     data += chunk.toString();
//   });

//   req.on('end', () => {
//     const user = JSON.parse(data);

//      fs.readFile(usersStore, "utf8", (err, data) => {
//        if (err) {
//          res.writeHead(500, { "Content-Type": "application/json" });
//          res.end(
//            JSON.stringify({
//              success: false,
//              error: err,
//            })
//          );
//        } else {
//          const users: [IUser] = JSON.parse(data);
//          const index = users.findIndex((t) => t.id === id);
//          users.splice(index, 1);
//          fs.writeFile(
//             usersStore,
//            JSON.stringify(users),
//            (err) => {
//              if (err) {
//                res.writeHead(500, { "Content-Type": "application/json" });
//                res.end(
//                  JSON.stringify({
//                    success: false,
//                    error: err,
//                  })
//                );
//              } else {
//                res.writeHead(200, { "Content-Type": "application/json" });
//                res.end(
//                  JSON.stringify({
//                    success: true,
//                    message: user,
//                  })
//                );
//              }
//            }
//          );
//        }
//      });
//    });
// };

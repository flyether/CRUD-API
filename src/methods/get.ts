import { IncomingMessage, ServerResponse } from 'http';
import { bd } from '../users/bd.js';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  try {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(bd));
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong');
  }
};

// with JSON
// import { IncomingMessage, ServerResponse } from 'http';
// import path from "node:path";
// import * as fs from "node:fs";
// import {fileURLToPath} from "url";
// const __filename = fileURLToPath(import.meta.url)
// const __dirnameUser = path.dirname(path.dirname(__filename));
// const usersStore = path.resolve(__dirnameUser, 'users/users.json');
// const usersStore = path.resolve(__dirnameUser, 'users/bd.ts');
// export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
//   return fs.readFile(
//     usersStore,
//     "utf8",
//     (err, data) => {
//       if (err) {
//         res.writeHead(500, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             success: false,
//             error: err,
//           })
//         );
//       } else {
//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             success: true,
//             message: JSON.parse(data),
//           })
//         );
//       }
//     }
//   );
// };

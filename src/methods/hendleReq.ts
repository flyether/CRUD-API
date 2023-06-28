import { deleteUser } from "./delete";
import { getUsers } from "./get";
import { getById } from "./getById";
import { postUser } from "./post";
import { putUser } from "./put";
import { IncomingMessage, ServerResponse } from 'http';

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
   const url = req.url;
 
   if (req.method === 'GET') {
     if (url === '/api/users' || url === '/api/users/') {
       return getUsers(req, res);
     } else if (url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
       const id = url.split('/')[3];
       return getById(req, res, id);
     }
   } else if (req.method === 'POST') {
     if (url === '/api/users' || url === '/api/users/') {
       return postUser(req, res);
     }
   } else if (req.method === 'PUT') {
     if (url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
       const id = url.split('/')[3];
       return putUser(req, res, id);
     }
   } else if (req.method === 'DELETE') {
     if (url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
       const id = url.split('/')[3];
       return deleteUser(req, res, id);
     }
   }
 
   res.writeHead(404, { 'Content-Type': 'text/plain' });
   res.end('Page not found');
 }
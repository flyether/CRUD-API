
import * as http from 'http';
import { deleteUser } from './methods/delete.js';
import { postUser } from './methods/post.js';
import { putUser } from './methods/put.js';
import { getUsers } from './methods/get.js';
import { getById } from './methods/getById.js';




export const router = (req: http.IncomingMessage, res: http.ServerResponse) => {

  
  console.log("request", ":" + req.headers.host, req.method, req.url);
  if ((req.method == 'GET' && req.url == '/api/users' ||req.method == 'GET' && req.url == '/api/users/' )) {
    return getUsers(req, res);
  } 
  else if (req.method == 'GET' && req.url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
    const id = req.url.split('/')[3];
    return getById(req, res, id);
  } 
  else if (req.method == 'POST' && req.url == '/api/users'|| req.method == 'POST' && req.url === '/api/users/') {
  
    return postUser(req, res);
  }
  
  else if (req.method == 'PUT' && req.url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
    const id = req.url.split('/')[3];
    return putUser(req, res, id);
  } 
   else if (req.method == 'DELETE' && req.url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
    const id = req.url.split('/')[3];
    return deleteUser(req, res, id);
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
};





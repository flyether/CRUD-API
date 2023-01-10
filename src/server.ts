import * as dotenv from 'dotenv';
import * as http from 'http';
import { deleteUser } from './methods/delete';
import { postUser } from './methods/post';
import { putUser } from './methods/put';
import { getUsers } from './methods/get';
import { getById } from './methods/getById';

dotenv.config();
const PORT = process.env.PORT as unknown as number;

export const server = http.createServer();
server.on('request', (req, res) => {
  
 
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
});


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

process.on('SIGINT', () =>{
  console.log( "остановка сервера");
  process.exit();
})
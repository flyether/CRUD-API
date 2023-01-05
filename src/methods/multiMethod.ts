import { bdMulti as bd } from "../multi";
import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate  } from 'uuid';



export const deleteUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
   try {
     if (validate(id)) {
       const index = bd.findIndex((t) => t.id === id);
 
       const userId = index !== -1 ? bd[index] : null;
 
       if (userId) {
         bd.splice(index, 1);
         res.writeHead(204, { 'Content-Type': 'text/plain' });
         res.end('');
       } else {
         res.writeHead(404, { 'Content-Type': 'text/plain' });
         res.end("userId doesn't exist");
       }
     } else {
       res.writeHead(400, { 'Content-Type': 'text/plain' });
       res.end('userId is invalid');
     }
   } catch {
     res.writeHead(500, { 'Content-Type': 'text/plain' });
     res.end('Something went wrong');
   }
 };

 export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
   try {
     res.writeHead(200, { 'Content-Type': 'application/json' });
     res.end(JSON.stringify(bd));
   } catch {
     res.writeHead(500, { 'Content-Type': 'text/plain' });
     res.end('Something went wrong');
   }
 };

 export const getById = (req: IncomingMessage, res: ServerResponse, id: string) => {
   try {
     if (validate(id)) {
       const index = bd.findIndex((t) => t.id === id);
 
       const userId = index !== -1 ? bd[index] : null;
 
       if (userId) {
         res.writeHead(200, { 'Content-Type': 'application/json' });
         res.end(JSON.stringify(bd[index]));
       } else {
         res.writeHead(404, { 'Content-Type': 'text/plain' });
         res.end("userId doesn't exist");
       }
     } else {
       res.writeHead(400, { 'Content-Type': 'text/plain' });
       res.end('userId is invalid');
     }
   } catch {
     res.writeHead(500, { 'Content-Type': 'text/plain' });
     res.end('Something went wrong');
   }
 };

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

 export const putUser = (req: IncomingMessage, res: ServerResponse, id: string) => {
   try {
     if (validate(id)) {
       let data = '';
 
       req.on('data', (chunk) => {
         data += chunk.toString();
       });
 
       req.on('end', () => {
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
import cluster from 'cluster';
import { cpus } from 'os';
import * as dotenv from 'dotenv';
import { createServer, request } from 'node:http';
import { IUser } from './models/interface';
import { v4 as uuidv4, validate } from 'uuid';
dotenv.config();

const numCPUs = cpus().length - 1;

if (cluster.isPrimary) {
  const bd: IUser[] = [
    {
      username: 'Hanna',
      age: 33,
      hobbies: ['drinking'],
    },
  ];
  const server = createServer((req, res) => {
    const workerNum = Math.floor(Math.random() * numCPUs);
    const redirectPort = 4001 + workerNum;

    const redirectOptions = {
      host: 'localhost',
      port: redirectPort,
      method: req.method,
      path: req.url,
    };

    const redirectReq = request(redirectOptions, (redirectRes) => {
      redirectRes.pipe(res);
    });
    req.pipe(redirectReq);
  });

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT: 4001 + i });

    worker.on('message', function (msg) {
      if (msg.msgFromWorker === 'GET') {
        worker.send(bd);
      }
      if (msg.msgFromWorker === 'POST') bd.push(msg.userFromPOST);
      if (msg.msgFromWorker === 'GETById') {
        const index = bd.findIndex((t) => t.id === msg.idFromGet);
        const userWithId = index !== -1 ? bd[index] : null;
        if (userWithId) {
          worker.send(userWithId);
        } else {
          worker.send('not');
        }
      }

      if (msg.msgFromWorker === 'DELETE') {
        const index = bd.findIndex((t) => t.id === msg.idFromDELETE);
        const userWithId = index !== -1 ? bd[index] : null;
        if (userWithId) {
          bd.splice(index, 1);
          worker.send(userWithId);
        } else {
          worker.send('not');
        }
      }
    });
  }

  cluster.on('death', function (worker) {
    console.log('Worker ' + worker.pid + ' died.');
  });

  server.listen(process.env.PORT);
} else {
  const port = process.env.PORT;
  const server = createServer();

  server.on('request', (req, res) => {
    if ((req.method == 'GET' && req.url == '/api/users') || (req.method == 'GET' && req.url == '/api/users/')) {
      try {
        console.log('request', ':' + req.headers.host, req.method, req.url);
        if (process.send) {
          process.send({ msgFromWorker: 'GET' });
        }
        process.once('message', (message: IUser[]) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(message));
        });
      } catch {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Something went wrong');
      }
    } else if (req.method == 'GET' && req.url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
      const id = req.url.split('/')[3];
      try {
        if (validate(id)) {
          if (process.send) {
            process.send({ msgFromWorker: 'GETById', idFromGet: id });
          }

          process.once('message', (message: IUser | string) => {
            if (message != 'not') {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(message));
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
    } else if (
      (req.method == 'POST' && req.url == '/api/users') ||
      (req.method == 'POST' && req.url === '/api/users/')
    ) {
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
            Array.isArray(user.hobbies) != true
          ) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('age(number) and username(string) and hobbies(array) are required fields with specific data types');
          } else {
            user.id = uuidv4();
            if (process.send) {
              process.send({ msgFromWorker: 'POST', userFromPOST: user });
            }
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
          }
        });
      } catch {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Something went wrong');
      }
    }

    // else if (req.method == 'PUT' && req.url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
    //   const id = req.url.split('/')[3];
    //   try {
    //    if (validate(id)) {
    //      let data = '';

    //      req.on('data', (chunk) => {
    //        data += chunk.toString();
    //      });

    //      req.on('end', () => {
    //        const user = JSON.parse(data);

    //        const index = bd.findIndex((t) => t.id === id);
    //        const userId = index !== -1 ? bd[index] : null;

    //        if (userId) {
    //          bd[index] = {
    //            id: bd[index].id,
    //            username: user.username || bd[index].username,
    //            age: user.age || bd[index].age,
    //            hobbies: user.hobbies || bd[index].hobbies,
    //          };
    //          res.writeHead(200, { 'Content-Type': 'application/json' });
    //          res.end(JSON.stringify(bd[index]));
    //        } else {
    //          res.writeHead(404, { 'Content-Type': 'text/plain' });
    //          res.end("userId doesn't exist");
    //        }
    //      });
    //    } else {
    //      res.writeHead(400, { 'Content-Type': 'text/plain' });
    //      res.end('userId is invalid');
    //    }
    //  } catch {
    //    res.writeHead(500, { 'Content-Type': 'text/plain' });
    //    res.end('Something went wrong');
    //  }
    // }
    else if (req.method == 'DELETE' && req.url?.match(/\/api\/users\/[a-zA-Z0-9]{1,}/)) {
      const id = req.url.split('/')[3];
      try {
        if (validate(id)) {
          if (process.send) {
            process.send({ msgFromWorker: 'DELETE', idFromDELETE: id });
          }

          process.once('message', (message: IUser | string) => {
            if (message != 'not') {
              res.writeHead(204, { 'Content-Type': 'text/plain' });
              res.end('');
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
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Page not found');
    }
  });

  server.listen(port, () => console.log(`Server is running on port ${port}`));
  console.log(`Worker ${process.pid} started`);
}

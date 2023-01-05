import cluster from 'cluster';
import { cpus } from 'os';
import * as dotenv from 'dotenv';
import { createServer, request } from 'node:http';
import { router } from './router';
import { IUser } from './models/interface';
dotenv.config();

export const bdMulti: IUser[] = []
const numCPUs = cpus().length -1;

if (cluster.isPrimary) {
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
 
  })
 
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: 4001 + i })
  }
  server.listen(process.env.PORT);
}

else {
     const port = process.env.PORT;
     const server = createServer((req, res) => {
        console.log( "в req.headers.host" + req.headers.host, `on port ${port}`);
        router(req, res);

  res.end()
     });
     server.listen(port, () => console.log(`Server is running on port ${port}`));
     console.log(`Worker ${process.pid} started`);

   }
  




  //  import cluster from 'cluster';
  //  import { cpus } from 'os';
  //  import * as dotenv from 'dotenv';
  //  import { createServer, request } from 'node:http';
  //  import { router } from './router';
  //  import { IUser } from './models/interface';
  //  dotenv.config();
   
  //  export const bdMulti: IUser[] = []
  //  const numCPUs = cpus().length -1;
   
  //  if (cluster.isPrimary) {
  //    const server = createServer((req, res) => {
   
  //    const workerNum = Math.floor(Math.random() * numCPUs);
  //      const redirectPort = 4001 + workerNum;
   
  //        const redirectOptions = {
  //        host: 'localhost',
  //        port: redirectPort,
  //        method: req.method,
  //        path: req.url,
  //    };
   
  //    const redirectReq = request(redirectOptions, (redirectRes) => {
  //      redirectRes.pipe(res);
  //    });
  //    req.pipe(redirectReq);
    
  //    })
    
  //    for (let i = 0; i < numCPUs; i++) {
  //      cluster.fork({ PORT: 4001 + i })
  //    }
  //    server.listen(process.env.PORT);
  //  }
   
  //  else {
  //       const port = process.env.PORT;
  //       const server = createServer((req, res) => {
  //          console.log( "в req.headers.host" + req.headers.host, `on port ${port}`);
  //          router(req, res);
   
  //    res.end()
  //       });
  //       server.listen(port, () => console.log(`Server is running on port ${port}`));
  //       console.log(`Worker ${process.pid} started`);
  //     }
     
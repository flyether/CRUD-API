import cluster from 'cluster';
import { cpus } from 'os';
import * as dotenv from 'dotenv';
import { createServer, request } from 'node:http';
import { router } from './router';

dotenv.config();

const numCPUs = cpus().length -1;
// const PORT = process.env.PORT as unknown as number;

if (cluster.isPrimary) {
  const server = createServer((req, res) => {
  router(req, res);
  const workerNum = Math.floor(Math.random() * numCPUs);
    const redirectPort = 4001 + workerNum;

      const redirectOptions = {
      host: 'localhost',
      port: redirectPort,
      method: req.method,
      path: req.url,
      headers: req.headers
  };
  const redirectReq = request(redirectOptions, (redirectRes) => {
    console.log(redirectOptions.port )
    redirectRes.pipe(res);
  });
  req.pipe(redirectReq);
  })

  server.listen(4000);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: 4001 + i })
    
  }
}

else {
 
     const port = process.env.PORT;
     const server = createServer((req, res) => {
  console.log( "хер", {port })
  router(req, res);
  res.end()
     });
   
     server.listen(port, () => console.log(`Server is running on port ${port}`));
     console.log(`Worker ${process.pid} started`);
   }
  



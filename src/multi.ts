import cluster from 'cluster';
import { cpus } from 'os';
import * as dotenv from 'dotenv';
import { createServer } from 'node:http';
import { router } from './s.js';
dotenv.config();
const numCPUs = cpus().length;

if (cluster.isPrimary) {
   console.log(`Primary ${process.pid} is running`);
 
   for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: 4000 + i })
   }
 
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   cluster.on('exit', (worker, code, signal) => {
     console.log(`worker ${worker.process.pid} died`);
   });
 } else {

  const PORT = process.env.PORT;
   createServer(router).listen(PORT, () => console.log(`Server is running on port ${PORT}`));
   console.log(`Worker ${process.pid} started`);
 }

 
 
 
 
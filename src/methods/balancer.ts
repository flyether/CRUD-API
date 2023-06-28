import cluster from 'cluster';
import { cpus } from 'os';
import { IUser } from '../models/interface';

export const balancer = (callback: () => void) => {
  if (cluster.isPrimary) {
   let bd: IUser[] = [];
    

    const numCPUs = cpus().length - 1;
    const PORTENV = parseInt((process.env.PORT || "4000") as string);
   //  console.log(`CPUs: ${numCPUs}`);
    console.log(`Master started. Pid: ${process.pid}`);

    for (let i = 0; i < numCPUs; i++)  {
      const worker = cluster.fork({ PORT: PORTENV +1 + i });
      worker.on('message', ({ method, data }) => {
        switch (method) {
          case 'get':
            worker.send(bd);
            break;
          case 'post':
            bd = data;
        }
      });
    }

    cluster.on('exit', (worker, code) => {
      console.log(`Worker died! Pid: ${worker.process.pid}. Code ${code}`);
      if (code === 1) {
        const worker = cluster.fork();
        worker.on('message', ({ method, data }) => {
          console.log(method, data);
          switch (method) {
            case 'get':
              worker.send(bd);
              break;
            case 'post':
               bd = data;
              break;
          }
        });
      }
    });
  }

  if (cluster.isWorker) {
    callback();
  }
};
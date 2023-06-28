import * as dotenv from 'dotenv';
import * as http from 'http';

import { handleRequest } from './methods/hendleReq';
import { balancer } from './methods/balancer';

dotenv.config();
const PORT = parseInt((process.env.PORT || "4000") as string);

// export const server = http.createServer();
// server.on('request', (req, res) => {
// handleRequest(req, res) 

// });


// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// process.on('SIGINT', () =>{
//   process.exit();
// })
// server.on('error', (error) => console.log(error.message));

const conditionValue = process.argv.find((arg) => arg.startsWith('--condition='))?.split('=')[1];
export const server = http.createServer((req, res) => {
  if (conditionValue === 'multi') {
    console.log(`Process pid: ${process.pid}`);
    (<any>process).send({ method: 'get' });
    process.on('message', async () => {
      handleRequest(req, res);
    });
  } else {
    handleRequest(req, res);
  }
});

if (conditionValue === 'multi') {
  balancer(() =>
    server.listen(process.env.PORT, () =>
      console.log(
        `Server runnig on port ${process.env.PORT}`,
        `Proccess ${process.pid} started`
      )
    )
  );
} else server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
process.on('SIGINT', () =>{
  process.exit();
})
server.on('error', (error) => console.log(error.message));
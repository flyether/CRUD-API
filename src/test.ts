import * as dotenv from 'dotenv';
import {  request } from 'node:http';
import * as http from 'http';



dotenv.config();
const PORT = process.env.PORT as unknown as number;

test('Get a single user by ID', () => {
  const userId = '123';
  const expectedResponse = {
    id: '123',
    name: 'Hey man',
    age: 220,
  };

  request(
    {
      hostname: 'localhost',
      port: PORT,
      path: `/api/users/${userId}`,
      method: 'GET',
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const response = JSON.parse(data);
        expect(response).toEqual(expectedResponse);
      });
    }
  );
});

test('Create a new user', () => {
  const newUser = {
    name: 'Jane Doe',
    age: 25,
  };
  const expectedResponse = {
    id: expect.any(String),
    name: 'Jane Doe',
    age: 25,
  };

  request(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const response = JSON.parse(data);
        expect(response).toEqual(expectedResponse);
      });
    }
  ).end(JSON.stringify(newUser));
});


function startServer(): http.Server {
  const server = http.createServer();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return server;
}

describe('PUT api/users/{userId}', () => {
  let server: http.Server;
  

  beforeEach(() => {
    server = startServer();
  });

  afterEach(() => {
    server.close();
  });

  it('should update an existing user', () => {
    const userId = '123';
    const updatedUser = {
      name: 'Dick from the mountain',
      age: 31,
    };
    const expectedResponse = {
      id: '123',
      name: 'Dick from the mountain',
      age: 31,
    };

    request(
      {
        hostname: 'localhost',
        port: PORT,
        path: `/api/users/${userId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const response = JSON.parse(data);
          expect(response).toEqual(expectedResponse);
        });
      }
    ).end(JSON.stringify(updatedUser));
  });

  it('should delete an existing user', () => {
    const userId = '123';
    const expectedResponse = 'User 123 deleted successfully';

    request(
      {
        hostname: 'localhost',
        port: PORT,
        path: `/api/users/${userId}`,
        method: 'DELETE',
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          expect(data).toEqual(expectedResponse);
        });
      }
    );
  });

});


import request from 'supertest';
import { IUser } from './models/interface';
import { bd } from './users/bd';
import { server } from './server';


let userId: string | number | undefined ;

const newUser: IUser = {
  age: 30,
  username: 'Sasha',
  hobbies: ['basketball', 'music'],
};

afterEach((done) => {
  server.close();
  done();
});

describe('api methods', () => {
  
  it('should return a list of users', async () => {
    const response = await request(server).get('/api/users/');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body).toEqual(bd);
  });

  it('should create a new user', async () => {
    const response = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ id: expect.any(String), ...newUser });
     userId =response.body.id ;
     console.log(userId , "41")
  });

  it('It should return the correct user when the id is valid', async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    console.log(userId , "52")
    const index = bd.findIndex((t) => t.id === userId);
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body).toEqual(bd[index]);
  });

  it('should update a user with a PUT request', async () => {
    const updatedUser: IUser = {
      age: 35,
      username: 'Masha',
      hobbies: ['basketball', 'music', 'reading']
    };
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ id: userId, ...updatedUser });
  });
  
  it('should delete a user with a DELETE request', async () => {
    const response = await request(server).delete(`/api/users/${userId}`);
    expect(response.status).toEqual(204);
  });
  
  it('should return 404 when getting a deleted user with a GET request', async () => {
    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toEqual(404);
  });

});







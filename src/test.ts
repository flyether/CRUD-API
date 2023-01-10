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

describe('api methods of all valid requests', () => {
  
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
  });

  it('It should return the correct user when the id is valid', async () => {
    const response = await request(server).get(`/api/users/${userId}`);
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



describe('api method PUT test for invalid requests ', () => {

  it('should return 404 Bad Request', async () => {
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send({ age: 35 })
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(404);
    expect(response.text).toEqual("userId doesn't exist");
  });
  
  it('should return 400 Bad Request for invalid user ID', async () => {
    const response = await request(server)
      .put(`/api/users/1234`)
      .send({
        username: 'Masha',
        age: 35,
        hobbies: ['basketball', 'music', 'reading']
      })
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(400);
    expect(response.text).toEqual('userId is invalid');
  });
});



describe('a test for the correct filling of the fields', () => {

  const newUserIncorrect= {
    age: "two",
    username: 'GARDE',
    hobbies: ['books', 'music'],
  };
  it("method POST should return 400 and a message about how the user's fields should be filled", async () => {
    const response = await request(server)
      .post('/api/users')
      .send(newUserIncorrect)
      .set('Content-Type', 'application/json');
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('age(number) and username(string) and hobbies(array) are required fields with specific data types');
  });

  it('should create a new user', async () => {
    const response = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({ id: expect.any(String), ...newUser });
     userId =response.body.id ;
  });

  it("method PUT should return 400 return 400 and a message about how the user's fields should be filled", async () => {
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .send({
        
        hobbies: 22
      })
      .set('Content-Type', 'application/json');
      expect(response.status).toEqual(400);
      expect(response.text).toEqual('age(number) and username(string) and hobbies(array) are required fields with specific data types');
  });
});


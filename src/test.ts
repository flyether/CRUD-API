import http from 'http';
import * as dotenv from 'dotenv';
dotenv.config();
import {  request } from 'node:http';
import { server } from './server';

describe('GET api/users', () => {
   it('should return a 200 status code and an array of all users', (done) => {
     const req = request('http://localhost:3000/api/users', (res) => {
       expect(res.statusCode).toBe(200);
       res.setEncoding('utf8');
       let body = '';
       res.on('data', (chunk) => {
         body += chunk;
       });
       res.on('end', () => {
         expect(JSON.parse(body)).toEqual(expect.any(Array));
         done();
       });
     });
     req.end();
   });
 });
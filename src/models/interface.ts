export interface IUser {
   id?: number | string;
   username: string;
   age: number;
   hobbies?: string[];
 }

 export interface IUsers {
   [key: number]: IUser;
 }
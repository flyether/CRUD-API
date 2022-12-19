export interface IUser {
   id?: number | string;
   username: string;
   age: string;
   hobbies?: string[];
 }

 export interface IUsers {
   [key: number]: IUser;
 }
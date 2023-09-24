
export namespace NUser {

  export enum Type {
    editor = 'editor',
    user = 'user',
    admin = 'admin',
  }

  export interface Item {
    id?: string;
    userName: string;
    email: string;
    password: string;
    createdAt?: Date;
  }

  export interface Role {
    id?: number;
    name: string;
    permissions?: number[];
  }
  
  export interface Permission {
    id?: number;
    name: string;
  }
}
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      query: any;
      body: any;
      params: any;
    }
  }
}

// Para los documentos de Mongoose
declare module 'mongoose' {
  interface Document {
    region?: any;
    createdAt?: Date;
    [key: string]: any;
  }
}

export {};
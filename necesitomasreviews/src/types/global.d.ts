// Esto hace que TypeScript sea permisivo con ciertas propiedades
declare namespace Express {
  export interface Request {
    user?: any;
  }
  export interface Response {
    [key: string]: any;
  }
}

// Para manejar documentos de Mongoose
interface Document {
  [key: string]: any;
}
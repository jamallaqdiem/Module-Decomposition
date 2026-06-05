declare global {
  namespace Express {
    interface Request {
      username: string | null;
    }
  }
}

export {};

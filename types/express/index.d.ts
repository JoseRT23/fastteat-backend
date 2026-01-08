// Type definitions for Express with custom user property

import 'express-serve-static-core';

export type UserToken = {
  user_id: string;
  business_id: string | null;
  name: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: UserToken;
  }
}
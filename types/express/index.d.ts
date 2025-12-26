// Type definitions for Express with custom user property

import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}
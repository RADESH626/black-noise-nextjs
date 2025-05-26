// This middleware is commented out as session-based auth has been removed.
// If you need route protection in the future, implement your new auth strategy here.

import { NextResponse } from 'next/server';

export function middleware(req) {
  // Add your new middleware logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: [] // Add route patterns that need middleware protection
};

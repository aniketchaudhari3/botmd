import { Botmd } from 'botmd';
import { NextRequest, NextResponse } from 'next/server';

const botmd = new Botmd({
  enabled: true,
  paths: {
    disallowed: ['/api/**', '/_next/**']
  },
  logRequests: true,
});

export async function middleware(request: NextRequest) {
  const response = await botmd.createResponse(request);
  if(!response.isBot) {
    return NextResponse.next();
  }

  return new NextResponse(response.content, { 
    headers: response.headers 
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};



import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Find the user in the database by email
    // 2. Compare the provided password with the stored hashed password
    // 3. If valid, generate a JWT or session token

    console.log(`Logging in user: ${email}`);

    // Simulate a successful login for any non-empty credentials
    // and return a dummy session.
    const session = {
      token: `dummy-token-for-${email}`,
      user: {
        displayName: 'Test User', // In a real app, you'd get this from your DB
        email: email,
      },
    };

    return NextResponse.json(session, { status: 200 });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

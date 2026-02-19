
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Hash the password
    // 2. Create a new user in your database
    // 3. Generate a JWT or session token

    console.log(`Signing up user: ${name}, ${email}`);

    // Simulate a successful signup and return a dummy session
    const session = {
      token: `dummy-token-for-${email}`,
      user: {
        displayName: name,
        email: email,
      },
    };

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

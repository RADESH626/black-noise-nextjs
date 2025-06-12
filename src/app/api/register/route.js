import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/DBconection';
import Usuario from '@/models/Usuario';
import errorHandler from '@/utils/errorHandler';

export async function POST(request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
}
    // Check if user already exists
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Create new user
    const newUser = new Usuario({
      email,
      password: hashedPassword,
      // Add other default fields if necessary, e.g., role
      role: 'user', // Default role
    });

    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return errorHandler(error);
  }
}

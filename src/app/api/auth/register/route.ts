import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required!" },
        { status: 400 }
      );
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return NextResponse.json(
        { error: "This email is already registered!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      addresses: [],
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "Account created successfully!",
        user: { name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
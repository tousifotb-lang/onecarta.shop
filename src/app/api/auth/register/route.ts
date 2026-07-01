import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        { error: "Name, phone, email, and password are required!" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if (existingUser) {
      if (existingUser.phone === normalizedPhone) {
        return NextResponse.json(
          { error: "This phone number is already registered!" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "This email is already registered!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: "user",
      isActive: true,
    });

    return NextResponse.json(
      {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "This email or phone number is already registered!" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
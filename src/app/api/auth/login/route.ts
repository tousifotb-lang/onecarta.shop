import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required!" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "No user found with this email." }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid password." }, { status: 400 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Your account is deactivated." }, { status: 403 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
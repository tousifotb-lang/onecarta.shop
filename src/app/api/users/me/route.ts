import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// এই route টা যেন কখনোই cache না হয়, প্রতিবার fresh data fetch করে
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById((session.user as any).id).select("-password").lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { name, phone, dob, gender } = body;

  const updated = await User.findByIdAndUpdate(
    (session.user as any).id,
    {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(dob !== undefined && { dob }),
      ...(gender !== undefined && { gender }),
    },
    { new: true }
  ).select("-password").lean();

  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updated, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
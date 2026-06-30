import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { label, name, phone, district, thana, homeAddress } = body;

  if (!name || !phone || !district || !thana || !homeAddress) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (!/^0\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "Phone number must be exactly 11 digits starting with 0" }, { status: 400 });
  }

  const user = await User.findById((session.user as any).id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isFirstAddress = user.addresses.length === 0;
  user.addresses.push({
    label: label || "Home",
    name, phone, district, thana, homeAddress,
    isDefault: isFirstAddress,
  });

  await user.save();
  return NextResponse.json(user.addresses, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { addressId } = await req.json();
  if (!addressId) {
    return NextResponse.json({ error: "addressId is required" }, { status: 400 });
  }

  const user = await User.findById((session.user as any).id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.addresses.forEach((addr: any) => {
    addr.isDefault = addr._id.toString() === addressId;
  });

  await user.save();
  return NextResponse.json(user.addresses, { status: 200 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { addressId } = await req.json();
  if (!addressId) {
    return NextResponse.json({ error: "addressId is required" }, { status: 400 });
  }

  const user = await User.findById((session.user as any).id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const wasDefault = user.addresses.find((a: any) => a._id.toString() === addressId)?.isDefault;
  user.addresses = user.addresses.filter((a: any) => a._id.toString() !== addressId) as any;

  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return NextResponse.json(user.addresses, { status: 200 });
}
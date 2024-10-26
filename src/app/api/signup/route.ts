import { NextResponse } from "next/server";
import signup from "@/src/app/lib/signup";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    console.log(body);
    

    // Call the signup function and pass the body as an object
    const { status, message } = await signup(body);

    // Return response based on the signup function's result
    return NextResponse.json({ message }, { status });
  } catch (error) {
    console.error("Signup route error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

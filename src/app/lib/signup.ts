import clientPromise from "./database";
import bcrypt from "bcrypt";

interface SignupBody {
  email: string;
  username: string;
  password: string;
  type: string;
}

export default async function signup({ email, username, password, type }: SignupBody) {
  if (!email || !username || !password) {
    return { status: 400, message: "Missing required fields" };
  }

  try {
    const client = await clientPromise;
    const db = client.db("ExamPortal");
    const usersCollection = db.collection("User Collection");

    // Check if username or email already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return { status: 409, message: "Username or email already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await usersCollection.insertOne({
      email,
      username,
      password: hashedPassword,
      type,
      createdAt: new Date(),
    });

    if (newUser.acknowledged) {
      return { status: 201, message: "User created and logged in" };
    } else {
      return { status: 500, message: "Failed to create user" };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
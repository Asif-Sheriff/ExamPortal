import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../lib/auth";
import { setQuestions } from "@/src/app/lib/questions";

export async function POST(req: NextRequest) {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session || !session?.user) {
        return NextResponse.json({}, { status: 401 });
    }

    try {
        const { questions, trustees } = await req.json()
        console.log({questions,trustees});
        
        
        const {status,message} = await setQuestions(questions,trustees);

        if (status !== 200) {
            return NextResponse.json( { status });
        }

        return NextResponse.json({
            message: 'Messages fetched successfully',
            status
            
            
        });
    } catch (error) {
        console.log("Error fetching messages: ", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
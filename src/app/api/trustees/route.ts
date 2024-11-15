import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../lib/auth";
import { getTrustees } from "../../lib/trustee";

export async function GET(req: NextRequest) {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session || !session?.user) {
        return NextResponse.json({}, { status: 401 });
    }
    try {
        const {status,data} = await getTrustees();

        if (status !== 200) {
            return NextResponse.json( { status });
        }

        return NextResponse.json({
            message: 'Messages fetched successfully',
            data
        });
    } catch (error) {
        console.log("Error fetching messages: ", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
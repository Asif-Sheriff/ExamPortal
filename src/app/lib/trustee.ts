import clientPromise from "./database";

export async function getTrustees() {
    try {
        const client = await clientPromise;
        const db = client.db("ExamPortal");
        const userCollection = db.collection("User Collection");

        // Query to find all trustee members
        const trustees = await userCollection.find({ type: "trustee" }).toArray();

        if (trustees.length > 0) {
            return { status: 200, data: trustees };
        } else {
            return { status: 404, message: "No trustees found" };
        }
    } catch (error) {
        console.log("Error while fetching trustees: ", error);
        return { status: 500, message: "Internal server error" };
    }
}

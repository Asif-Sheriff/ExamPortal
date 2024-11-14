import clientPromise from "./database";

export async function setQuestions(questions: any, trustees: any) {
  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db("ExamPortal");
    const questionCollection = db.collection("Question Collection");

    // Create the document to be inserted
    const document = {
      questions,
      trustees,
      createdAt: new Date(), 
    };

    // Insert the document into the collection
    const result = await questionCollection.insertOne(document);

    if (result.acknowledged) {
      return { status: 200, message: "Questions successfully added" };
    } else {
      return { status: 500, message: "Failed to insert questions" };
    }
  } catch (error) {
    console.error("Error while inserting questions: ", error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function getQuestions() {
  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db("ExamPortal");
    const questionCollection = db.collection("Question Collection");

    // Fetch all documents from the collection
    const result = await questionCollection.find({}).toArray();

    // Return the questions if found
    if (result) {
      return { status: 200, data: result };
    } else {
      return { status: 404, message: "No questions found" };
    }
  } catch (error) {
    console.error("Error while fetching questions: ", error);
    return { status: 500, message: "Internal server error" };
  }
}


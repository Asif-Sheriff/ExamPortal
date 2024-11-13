import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "./lib/auth";
import { redirect } from "next/navigation";
import Appbar from "../components/Appbar";

export default async function Home() {
  const session =  await getServerSession(NEXT_AUTH_CONFIG);

  if(!session?.user){
    redirect('/signin/student');
  }

  return (
    <div >
      <Appbar />
      {JSON.stringify(session)}
    </div>
  );
}
import { getServerSession } from "next-auth";
import Appbar from "../components/Appbar";
import { NEXT_AUTH_CONFIG } from "./lib/auth";

export default async function Home() {
  const session =  await getServerSession(NEXT_AUTH_CONFIG);
  return (
    <div>
      <Appbar />
      {JSON.stringify(session)}
      
      

    </div>
  );
}

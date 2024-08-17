import { credentials, updatePawnoteToken } from "./_credentials";
import { Authenticator } from "../src";

void async function main () {
  // Initialize the ARD client.
  const authenticator = new Authenticator();
  // Authenticate the ARD client using the PRONOTE ticket URL.
  const client = await authenticator.fromCredentials("montpellier-eplefpa", credentials.username!, credentials.password!);

  // Do whatever you want with the "client" instance !
  console.log("Connected to ARD for", client.schoolID);

  const payments = await client.getOnlinePayments();
  console.log(payments);
}();

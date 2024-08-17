import { ARD_BASE_ENDPOINT, ARD_HOST } from "~/utils/constants";

import { type OnlinePayments, getOnlinePayments } from "~/api/online-payments";
import { findValueBetween } from "@literate.ink/utilities";

export class Client {
  public constructor (
    public schoolID: string,
    public schoolName: string,
    public schoolImageURL: string,
    public cookies: string[]
  ) {};

  public async getOnlinePayments (): Promise<OnlinePayments> {
    return getOnlinePayments(this.schoolID, this.cookies);
  }

  public static fromAPI (html: string, cookies: string[]) {
    const schoolID = findValueBetween(html, ARD_BASE_ENDPOINT.slice(1) + "/", "/accueil.html");
    const [schoolImagePath, , schoolName] = findValueBetween(html, "<img src=\"", "\" />").split("\"");
    const schoolImageURL = ARD_HOST + "/" + schoolImagePath;

    return new Client(schoolID, schoolName, schoolImageURL, cookies);
  }
}

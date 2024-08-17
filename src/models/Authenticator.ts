import { findValueBetween, defaultFetcher, Response, Request, setHeaderToRequest, getHeaderFromResponse, getCookiesFromResponse } from "@literate.ink/utilities";
import { ARD_HOST } from "~/utils/constants";
import { Client } from "~/models/Client";
import forge from "node-forge";
import { createEndpointURL } from "~/utils/endpoints";

const md5 = (data: string): string => forge.md.md5.create().update(data, "utf8").digest().toHex();

export class Authenticator {
  public async fromCredentials (establishmentID: string, username: string, password: string) {
    const url = createEndpointURL(establishmentID, "accueil.html");
    let response: Response;
    let html: string;

    response = await defaultFetcher({ url: new URL(url) });
    html = response.content;

    const params = new URLSearchParams();
    params.set("user", username);

    const START = "<input type=\"hidden\" name=\"";
    const START_BETWEEN = "\" value=\"";
    const END = "\" />";
    const read = (name: string) => {
      return findValueBetween(html, START + name + START_BETWEEN, END);
    };

    const challenge = read("challenge");

    let hashed_password = md5(password);
    hashed_password = md5(username + ":" + hashed_password + ":" + challenge);

    params.set("pass", hashed_password);

    params.set("submit", "VALIDER");
    params.set("logintype", read("logintype"));
    params.set("pid", read("pid"));
    params.set("redirect_url", "");
    params.set("challenge", challenge);

    const request: Request = {
      url: new URL(url + "?no_cache=1"),
      method: "POST",
      content: params.toString()
    };

    setHeaderToRequest(request, "Content-Type", "application/x-www-form-urlencoded");
    response = await defaultFetcher(request);

    const cookies = getCookiesFromResponse(response);
    this.check(cookies);

    return Client.fromAPI(response.content, cookies);
  }

  /**
   * Authenticates the user using a ticket coming from PRONOTE.
   * @param pronoteTicketURL The URL of the PRONOTE ticket.
   *
   * @example
   * // Example URL that could be given by PRONOTE.
   * const pronoteTicketURL = "https://services.ard.fr/fr/espaces-clients/etablissements/pronote.html?ticket=ST-123456789012345678912346789";
   *
   * const authenticator = new Authenticator();
   * const client = await authenticator.fromPronoteTicket(pronoteTicketURL);
   */
  public async fromPronoteTicket (pronoteTicketURL: string) {
    let redirectedURL: string;
    let response: Response;
    let cookies: string[];

    response = await defaultFetcher({
      url: new URL(pronoteTicketURL),
      redirect: "manual"
    });

    redirectedURL = getHeaderFromResponse(response, "location")!;
    cookies = getCookiesFromResponse(response);

    response = await defaultFetcher({
      url: new URL(redirectedURL),
      headers: {
        "Cookie": cookies.join("; ")
      },
      redirect: "manual"
    });

    redirectedURL = ARD_HOST + getHeaderFromResponse(response, "location")!;
    cookies = [...cookies, ...getCookiesFromResponse(response)];
    this.check(cookies);

    response = await defaultFetcher({
      url: new URL(redirectedURL),
      headers: {
        "Cookie": cookies.join("; ")
      },
      redirect: "manual"
    });

    return Client.fromAPI(response.content, cookies);
  }

  private check (cookies: string[]): void {
    if (!cookies.some((cookie) => cookie.startsWith("fe_typo_user="))) {
      throw new Error("Bad authentication.");
    }
  }
}

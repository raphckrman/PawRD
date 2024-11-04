import { ARD_BASE_ENDPOINT, ARD_HOST } from "~/utils/constants";

import { type OnlinePayments, getOnlinePayments } from "~/api/online-payments";
import { findValueBetween } from "@literate.ink/utilities";
import { FinancialHistoryEvent, getFinancialHistory, getOrdersHistory, OrderHistoryEvent, getConsumptionsHistory, ConsumptionHistoryEvent } from "~/api/history";

export class Client {
  public constructor (
    public pid: string,
    public schoolID: string,
    public schoolName: string,
    public schoolImageURL: string,
    public cookies: string[]
  ) {};

  public async getOnlinePayments (): Promise<OnlinePayments> {
    return getOnlinePayments(this.schoolID, this.cookies);
  }

  public async getFinancialHistory(uid: number, startTimestamp: number = 1, endTimestamp: number = Date.now(), limit: number = 30): Promise<FinancialHistoryEvent[]> {
    return getFinancialHistory(uid, startTimestamp, endTimestamp, limit, this.cookies);
  }

  public async getOrdersHistory(uid: number, startTimestamp: number = 1, endTimestamp: number = Date.now(), limit: number = 30): Promise<OrderHistoryEvent[]> {
    return getOrdersHistory(uid, startTimestamp, endTimestamp, limit, this.cookies);
  }

  public async getConsumptionsHistory(uid: number, startTimestamp: number = 1, endTimestamp: number = Date.now(), limit: number = 30): Promise<ConsumptionHistoryEvent[]> {
    return getConsumptionsHistory(uid, startTimestamp, endTimestamp, limit, this.cookies);
  }

  public static fromAPI (html: string, cookies: string[] = [], pid = "") {
    const schoolID = findValueBetween(html, ARD_BASE_ENDPOINT.slice(1) + "/", "/accueil.html");
    const [schoolImagePath, , schoolName] = findValueBetween(html, "<img src=\"", "\" />").split("\"");
    const schoolImageURL = ARD_HOST + "/" + schoolImagePath;

    return new Client(pid, schoolID, schoolName, schoolImageURL, cookies);
  }
}

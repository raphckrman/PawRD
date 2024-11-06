import { USER_AGENT } from "~/utils/constants";
import { createAjaxEndpoint, createEndpointURL } from "~/utils/endpoints";

export interface FinancialHistoryEvent {
  operation_uid: number;
  operationDate: number
  operationName: string;
  eWalletName: string;
  beneficiary_uid: number;
  paymentMethod: string;
  credit: number | null;
  debit: number | null;
}

export interface OrderHistoryEvent {
  order_uid: number;
  orderDate: number;
  orderReference: number;
  sponsorName: number;
  state: number;
  amount: number;
}

export interface ConsumptionHistoryEvent {
  consumption_uid: number;
  consumptionDate: number;
  consumptionDescription: string;
  amount: number;
  eWalletName: string;
}

export const getFinancialHistory = async (uid: number, startTimestamp: number, endTimestamp: number, limit: number = 30, cookies: string[]): Promise<FinancialHistoryEvent[]> => {
  const response = await fetch(createAjaxEndpoint(`?eID=tx_afereload_ajax_financialhistory&fe_uid=${uid}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&page=1&start=0&limit=${limit}`), {
    headers: { "Cookie": cookies.join("; "), "User-Agent": USER_AGENT },
    credentials: "omit"
  });

  const data = await response.json() as unknown as { total: number, operations: FinancialHistoryEvent[] };

  return data.operations;
};

export const getOrdersHistory = async (uid: number, startTimestamp: number, endTimestamp: number, limit: number = 30, cookies: string[]): Promise<OrderHistoryEvent[]> => {
  const response = await fetch(createAjaxEndpoint(`?eID=tx_afereload_ajax_ordershistory&fe_uid=${uid}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&page=1&start=0&limit=${limit}`), {
    headers: { "Cookie": cookies.join("; "), "User-Agent": USER_AGENT },
    credentials: "omit"
  });

  const data = await response.json() as unknown as { total: number, orders: OrderHistoryEvent[] };
  return data.orders;
};

export const getConsumptionsHistory = async (uid: number, startTimestamp: number, endTimestamp: number, limit: number = 30, cookies: string[]): Promise<ConsumptionHistoryEvent[]> => {
  const response = await fetch(createAjaxEndpoint(`?eID=tx_afereload_ajax_consumptionhistory&fe_uid=${uid}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&page=1&start=0&limit=${limit}`), {
    headers: { "Cookie": cookies.join("; "), "User-Agent": USER_AGENT },
    credentials: "omit"
  });

  const data = await response.json() as unknown as { total: number, consumptions: ConsumptionHistoryEvent[] };
  return data.consumptions;
};

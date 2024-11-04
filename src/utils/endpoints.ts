import { ARD_BASE_ENDPOINT_WITH_HOST, ARD_HOST } from "~/utils/constants";

export const createEndpointURL = (schoolID: string, path: string): string => {
  return `${ARD_BASE_ENDPOINT_WITH_HOST}/${schoolID}/${path}`;
};

export const createAjaxEndpoint = (path: string): string => {
  return `${ARD_HOST}/${path}`;
};

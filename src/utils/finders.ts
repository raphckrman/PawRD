import { findValueBetween } from "@literate.ink/utilities";

/**
 * Data on a route is contained into that single
 * variable in a script tag. Content is encoded in JSON, as a string.
 */
export const findAndReadGecData = <T extends {} = {}>(html: string): T => {
  const value = findValueBetween(html, "var gecData = ", "</script");
  return JSON.parse(value);
};

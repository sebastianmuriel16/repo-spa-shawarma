import { type Data, type ApiSearchResponse } from "../types";
import { API_HOST } from "../config.ts";

export const searchFile = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`);

    if (!res.ok) {
      return [new Error(`Error searching: ${res.statusText}`)];
    }

    const json = (await res.json()) as ApiSearchResponse;
    return [undefined, json.data];
  } catch (err) {
    if (err instanceof Error) {
      return [err];
    }
  }

  return [new Error("unknown error")];
};

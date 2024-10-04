import { type Data, ApiUploadResponse } from "../types";
import { API_HOST } from "../config.ts";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return [new Error(`Something went wrong: ${res.statusText}`)];
    }
    const json = (await res.json()) as ApiUploadResponse;
    return [undefined, json.data];
  } catch (err) {
    if (err instanceof Error) {
      return [err];
    }
  }

  return [new Error("unknown error")];
};

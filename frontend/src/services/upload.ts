import { type Data, ApiUploadResponse } from "../types";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/api/files", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return [new Error(`Something went wrong: ${res.status}`)];
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

import { useState } from "react";
import { uploadFile } from "./services/upload.ts";
import { Search } from "./steps/search.tsx";
import { type Data } from "./types.ts";
import { toast, Toaster } from "sonner";

import "./App.css";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "subir archivo",
  [APP_STATUS.UPLOADING]: "subiendo...",
};

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [data, setData] = useState<Data>([]);
  const [file, setFile] = useState<File | null>();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }

    console.log(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || appStatus !== APP_STATUS.READY_UPLOAD) {
      return;
    }

    setAppStatus(APP_STATUS.UPLOADING);

    const [error, newData] = await uploadFile(file);
    console.log({ newData });
    if (error) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(error.message);
      return;
    }

    setAppStatus(APP_STATUS.READY_USAGE);
    if (newData) setData(newData);
    toast.success("File uploaded successfully");
  };

  const showButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;

  const showInput = appStatus !== APP_STATUS.READY_USAGE;

  return (
    <>
      <Toaster />
      <h4>challenge: Upload and search lalaall</h4>
      {showInput && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="">
            <input
              disabled={appStatus === APP_STATUS.UPLOADING}
              name="file"
              type="file"
              accept=".csv"
              onChange={handleInputChange}
            />
          </label>
          {showButton && (
            <button disabled={appStatus === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[appStatus]}
            </button>
          )}
        </form>
      )}

      {appStatus === APP_STATUS.READY_USAGE && <Search initialData={data} />}
    </>
  );
}

export default App;

import expres from "express";
import cors from "cors";
import multer from "multer";
import csvTojson from "convert-csv-to-json";

const app = expres();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let userData: Array<Record<string, string>> = [];

app.use(cors()); //enable cors

app.post("/api/files", upload.single("file"), async (req, res) => {
  // 1. extract file from request
  const { file } = req;
  // 2. validate that file from request
  if (!file) {
    res.status(500).json({ message: "file is required" });
  }
  // 3. validate the mimetype (cvs)
  if (file!.mimetype !== "text/csv") {
    res.status(500).json({ message: "file must be a csv" });
  }

  let json: Array<Record<string, string>> = [];
  // 4. trasform the file (buffer)  to string
  try {
    const rawCsv = Buffer.from(file!.buffer).toString("utf-8");
    console.log(rawCsv);
    // 5. transform the string (csv) to json
    json = csvTojson.fieldDelimiter(",").csvStringToJson(rawCsv);
  } catch (error) {
    res.status(500).json({ message: "error parsing the file" });
  }

  // 6. save de Json to db (or memory)
  userData = json;
  //7 return 200 with the message and the json
  res
    .status(200)
    .json({ data: json, message: "el archivo se cargo correctamente" });
});

app.get("/api/users", async (req, res) => {
  //1 extract query param q form request
  const { q } = req.query;
  //2 validate that we have the query param
  if (!q) {
    res.status(500).json({ message: "query param is required" });
  }
  if (typeof q !== "string") {
    res.status(500).json({ message: "query param must be a string" });
  }

  //3. filter the data from the db (or memory) with the query param
  const search = q!.toString().toLowerCase();
  //4. return 200 with the filter data
  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) => {
      return value.toLocaleLowerCase().includes(search);
    });
  });

  res.status(200).json({ data: filteredData });
});

console.log("Server running on port 3000");

app.listen(port, () => {
  console.log(`Listening on port  http://localhost:${port}`);
});

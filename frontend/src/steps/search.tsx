import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { searchFile } from "../services/search.ts";
import { useDebounce } from "@uidotdev/usehooks";
import { type Data } from "../types.ts";

const DEBONCE_TIME = 500;
export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") || "";
  });
  const debounbedSearch = useDebounce(search, DEBONCE_TIME);

  const handleSarch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
  };

  useEffect(() => {
    const newPathname =
      debounbedSearch === ""
        ? window.location.pathname
        : `?q=${debounbedSearch}`;

    window.history.pushState({}, "", newPathname);
  }, [debounbedSearch]);

  useEffect(() => {
    //llamada a la api para filtrar los datos
    if (!debounbedSearch) {
      setData(initialData);
      return;
    }
    searchFile(debounbedSearch).then((response) => {
      const [error, newData] = response;
      if (error) {
        toast.error(error.message);
        return;
      }
      if (newData) setData(newData);
    });
  }, [initialData, debounbedSearch]);

  return (
    <div>
      <Toaster />
      <h1>Search</h1>
      <form action="">
        <input
          onChange={handleSarch}
          type="search"
          placeholder="Search..."
          defaultValue={search}
        />
      </form>
      <ul>
        {data.map((row) => (
          <li key={row.id}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}</strong>: <strong>{value}</strong>
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};

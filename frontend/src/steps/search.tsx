import { useEffect, useState } from "react";
import { type Data } from "../types.ts";

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);
  const [search, setSearch] = useState<string>("");

  const handleSarch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    setSearch(newSearch);
  };

  useEffect(() => {
    const newPathname =
      search === "" ? window.location.pathname : `?q=${search}`;

    window.history.pushState({}, "", newPathname);
  }, [search]);

  useEffect(() => {
    //llamadaa a la api para filtrar los datos
  }, [data]);

  return (
    <div>
      <h1>Search</h1>
      <form action="">
        <input onChange={handleSarch} type="search" placeholder="Search..." />
      </form>
    </div>
  );
};

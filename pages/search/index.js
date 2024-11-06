import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import { useUser } from "../../context/UserContext";

const Search = () => {
  const router = useRouter();
  const { userId } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = userId || sessionStorage.getItem("userId");

      if (!storedUserId) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [userId, router]);

  return <div>{isAuthenticated ? <SearchComponent /> : null}</div>;
};

export default Search;
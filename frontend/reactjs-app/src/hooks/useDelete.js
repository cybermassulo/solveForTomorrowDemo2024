import { useState, useEffect } from "react";
import axios from "axios";

const useDelete = () => {
  const [isLoadingDelete, setIsLoadingDeleteDelete] = useState(true);
  const [errorDelete, setErrorDeleteDelete] = useState(null);

  const handleDelete = async ({ url, id }) => {
    setIsLoadingDeleteDelete(true);
    setErrorDeleteDelete(null);
    try {
      await axios.delete(url + "/" + id);
    } catch (errorDelete) {
      setIsLoadingDeleteDelete(false);
      setErrorDeleteDelete(errorDelete.message);
    } finally {
      setIsLoadingDeleteDelete(false);
    }
  };
  return { isLoadingDelete, errorDelete, handleDelete };
};

export default useDelete;

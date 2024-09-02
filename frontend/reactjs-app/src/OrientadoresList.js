import React, { useState, useEffect } from "react";
import { useFetchData } from "./hooks/useFetchData";
import Loading from "./Loading";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";

function OrientadoresList() {
  const {
    data: orientadores,
    loading,
    error,
  } = useFetchData(process.env.REACT_APP_API_URL + "/orientadores");
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "nome", headerName: "Nome", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "instituicao", headerName: "Instituição", width: 300, flex: 1 },
  ];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <h2>Orientadores</h2>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={orientadores}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrientadoresList;

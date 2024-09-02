import React, { useState, useEffect } from "react";
import { useFetchData } from "./hooks/useFetchData";
import Loading from "./Loading";
import { format } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ConfirmDialog from "./ConfirmDialog";
import useDelete from "./hooks/useDelete";
import MessageSnackbar from "./MessageSnackbar";

function ProjetosList() {
  const {
    data: projetos,
    loading,
    error,
  } = useFetchData(process.env.REACT_APP_API_URL + "/projetos");
  const [rows, setRows] = useState(projetos);

  const { isLoadingDelete, errorDelete, handleDelete } = useDelete();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const handleClickDelete = (id, name) => {
    setItemToDelete({ id, name });
    setOpen(true);
  };
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleError = () => {
    setOpenSnackbar(true);
    setSnackbarSeverity("error");
    setSnackbarMessage("Erro ao excluir o item.");
  };
  const deletar =  () => {
    // Chame sua função de exclusão aqui
    setOpen(false);
    // Atualize a lista de itens e exiba uma mensagem de sucesso
    const url = process.env.REACT_APP_API_URL + "/projetos";
    const id = itemToDelete.id;
    handleDelete({ url, id });
    if (errorDelete !== null) {
      handleError();
    }
    if (errorDelete === null) {
      const updatedRows = rows.filter((row) => row.id !== id);
      setRows(updatedRows);
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Item deletado com sucesso");
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => handleClickDelete(params.id, params.row.nome)}
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "nome", headerName: "Nome", width: 200 },
    { field: "descricao", headerName: "Descrição", width: 300, flex: 1 },
    {
      field: "data_inicio",
      headerName: "Data de Início",
      type: "date",
      width: 150,
      valueFormatter: (params) => {
        if (!params) {
          return "Sem início";
        } else {
          return format(new Date(params), "dd/MM/yyyy");
        }
      },
    },
    {
      field: "data_fim",
      headerName: "Data de Término",
      type: "date",
      width: 150,
      valueFormatter: (params) => {
        if (!params) {
          return "Em andamento";
        } else {
          return format(new Date(params), "dd/MM/yyyy");
        }
      },
    },
  ];

  useEffect(() => {
    setRows(projetos);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [projetos]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <h2>Projetos</h2>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              localeText={{ ptBR: { noRowsLabel: "Sem projetos" } }}
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection
            />
            <ConfirmDialog
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={deletar}
              title="Confirmar exclusão"
              content={`Tem certeza que deseja excluir o item ${itemToDelete?.name} (ID: ${itemToDelete?.id})?`}
            />
            <MessageSnackbar
              open={openSnackbar}
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarSeverity}
              message={snackbarMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjetosList;

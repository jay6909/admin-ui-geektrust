import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  GridRowModes,
  GridRowEditStopReasons,
  DataGrid,
  GridActionsCellItem,
  GridDeleteIcon, 
} from "@mui/x-data-grid";
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import axios from "axios";
import { Button, Typography } from "@mui/material";
import SearchBar from "./SearchBar";

const DataGridPanel = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [platformView, setPlatformView] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  /**
   * users:{
   *    id:1,
   *    name: exampleName,
   *    email: example@email.com,
   *    role:admin/member,
   * }
   * 
   * 
   */

  //columns of tables
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      editable: true,
      valueGetter: (params) => `${params.row.name || ""}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      width: 110,
      editable: true,
    },
    {
      field: "actions",
      sortable: false,
      headerName: "Actions",
      cellClassName: "actions",

      sort: false,
      width: 100,
      renderCell: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<GridDeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
  ];

  /**
   * fetchUsers
   */
  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, []);

  /**
   * fetchUser() fetches users and stores it in setUsers
   */
  const fetchUsers = async () => {
    const users = await axios.get(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    setUsers(users.data);
    setPlatformView(users.data);
  };

  /**
   * 
   * @param {Object} params 
   * @param {Event} event 
   */
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  /**
   * Accepts an ID and handles edit for that row
   * @param {Number} id 
   * 
   */
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  /**
   * Accepts an ID and handles save edit for that row
   * @param {Number} id 
   * 
   */
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  /**
   * Accepts an ID and deletes that row
   * @param {Number} id 
   * 
   */
  const handleDeleteClick = (id) => () => {
    setUsers(users.filter((row) => row.id !== id));
    setPlatformView(users.filter((row) => row.id !== id));


  };


  /**
   * Accepts an ID and handles cancel edit button click for that row
   * @param {Number} id 
   * 
   */
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  }
    /**
     * accepts rowSelectionModel as params from DataGrid and updates setSelected
     * @param {rowSelectionModel} rowSelectionModel
     */
    const onSelectionChange = (rowSelectionModel) => {
      // e.preventDefault()
      // console.log(rowSelectionModel)
      setSelected(rowSelectionModel);
    };

    /**
     * accepts Array of items of only id's and deletes from users
     * @param {Array} listToDelete
     */
    const deleteRows = (listToDelete) => {
      let data = users.filter((user) => !listToDelete.includes(user.id));

      setUsers(data);
      setPlatformView(data)
    };

    /**
     * Accept string removes escape values and returns string
     * @param {String} value
     * @returns {String}
     */
    const escapeValExp = (value) => {
      return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    /**
     * accepts {String} and searches it in users and filters results based on search
     * @param {String} searchString
     */
    const searchDataGrid = (searchString) => {
      const searchRegex = new RegExp(escapeValExp(searchString), "i");
      const filteredRows = platformView.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setUsers(filteredRows);
    };

    return (
      <Box sx={{ height: "100%", width: "100%" }}>

        <Typography  fontSize={"2rem"}>
            ADMIN UI
        </Typography>
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          platformView={platformView}
          setPlatformView={setPlatformView}
          searchDataGrid={searchDataGrid}
          setUsers={setUsers}
          users={users}
        />
         <Box sx={{ height: "100%", mt: 1 }}>

         <DataGrid
        
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop}
        onRowSelectionModelChange={onSelectionChange}
        disableRowSelectionOnClick
      />
     {selected.length<1 ? <></>:
      <Button
      color="error"
      onClick={() => deleteRows(selected)}
      startIcon={<GridDeleteIcon />}
    >
      DELETE
    </Button>}
         </Box>
        
      </Box>
    );
  };
export default DataGridPanel;

import { Box, IconButton, TextField } from '@mui/material';
import { GridClearIcon, GridSearchIcon } from '@mui/x-data-grid';
import React from 'react'

const SearchBar = ({searchText,setSearchText,searchDataGrid,setUsers,platformView}) => {
  return (
    <Box minWidth={"500px"}>
    <TextField 
        variant="standard"
        value={searchText}
        onChange={(e) => { setSearchText(e.target.value); searchDataGrid(e.target.value) }}
        placeholder="Search by name, email, role"
        InputProps={{
            startAdornment: <GridSearchIcon fontSize="small" color="action" />,
            endAdornment: (
                <IconButton
                    title="Clear"
                    aria-label="Clear"
                    size="small"
                    style={{ visibility: searchText ? 'visible' : 'hidden', borderRadius: "57%", paddingRight: "1px", margin: "0", fontSize: "1.25rem" }}
                    onClick={(e) => {setSearchText(''); setUsers(platformView)} }
                >
                    <GridClearIcon fontSize="small" color="action" />
                </IconButton>
            ),
        }}
        sx={{
            width: { xs: 1, sm: 'auto' }, m: (theme) => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
                mr: 0.5,
            },
            '& .MuiInput-underline:before': {
                borderBottom: 1,
                borderColor: 'divider',
            },
        }}
    />
</Box>

  )
}

export default SearchBar
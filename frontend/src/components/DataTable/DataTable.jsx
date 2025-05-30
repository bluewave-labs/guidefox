import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  Popover,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Tune, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import './TableStyles.css';

const DataTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [filterOptions, setFilterOptions] = useState({
    name: true,
    status: true,
    role: true,
    team: true,
    hireDate: true,
    employeeNo: false,
    employmentStatus: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    setFilterOptions({
      ...filterOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const filteredData = data;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const displayData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="tableContainer">
      <div className="companyHeading">
        Company Members
        <span className="totalEntriesCircle"> {data.length}</span>
      </div>
      <Button
        variant="outlined"
        onClick={handleOpenPopover}
        className="customize-btn"
        startIcon={<Tune />}
      >
        Customize
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <div className="popoverContent">
          {Object.entries(filterOptions).map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={value}
                  onChange={handleFilterChange}
                  name={key}
                />
              }
              label={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </div>
      </Popover>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="tableHeadRow">
            <TableRow>
              {Object.entries(filterOptions).map(
                ([key, value]) =>
                  value && (
                    <TableCell key={key} className="tableCell">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((row) => (
              <TableRow key={row.id}>
                {Object.entries(filterOptions).map(
                  ([key, value]) =>
                    value && (
                      <TableCell key={key} className="tableCell">
                        {row[key]}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="paginationContainer">
        <button
          className="direct_buttons"
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
        >
          <ArrowBackIosNew />
          Previous
        </button>
        <div className="paginationNumbers">
          {Array.from(Array(pageCount).keys()).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handleChangePage(pageNumber)}
              disabled={pageNumber === page}
            >
              {pageNumber + 1}
            </button>
          ))}
        </div>
        <button
          className="direct_buttons"
          onClick={() => handleChangePage(page + 1)}
          disabled={page >= pageCount - 1}
        >
          Next
          <ArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DataTable;

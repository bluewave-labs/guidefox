import React from 'react';
import PropTypes from 'prop-types';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from './TablePaginationActions';
import DropdownMenu from '../../DropdownMenu/DropdownMenu';

const PaginationTable = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  rowsPerPageOptions = [5, 10, 25, { label: 'All', value: -1 }],
  count,
  colSpan,
  labelRowsPerPage,
  component = 'td',
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      component={component}
      rowsPerPageOptions={rowsPerPageOptions}
      colSpan={colSpan}
      labelRowsPerPage={labelRowsPerPage}
      slots={{
        select: <DropdownMenu menuItems={rowsPerPageOptions} />,
      }}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );
};

PaginationTable.propTypes = {
  component: PropTypes.elementType,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.array,
  labelRowsPerPage: PropTypes.string,
  colSpan: PropTypes.number,
  count: PropTypes.number.isRequired,
  setRowsPerPage: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default PaginationTable;

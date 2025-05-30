import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import styles from './TeamTable.module.css';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useAuth } from '../../../../services/authProvider';
import DropdownMenu from '@components/DropdownMenu/DropdownMenu';
import { roles } from '../../../../utils/constants';
import PaginationTable from '@components/Pagination/TablePagination/PaginationTable';
import PropTypes from 'prop-types';

const TeamTable = ({
  team,
  setRemoveModalOpen,
  setChangeRoleModalOpen,
  setSelectedMember,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { userInfo } = useAuth();

  const handleRemoveMember = async (member) => {
    setSelectedMember(() => member);
    setRemoveModalOpen(() => true);
  };

  const handleChangeRole = async (e, member) => {
    setSelectedMember(() => ({ ...member, newRole: e.target.innerText }));
    setChangeRoleModalOpen(() => true);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow className={styles.tableHeader}>
            <TableCell className={styles.heading}>NAME</TableCell>
            <TableCell className={styles.heading}>EMAIL</TableCell>
            <TableCell className={styles.heading}>ROLE</TableCell>
            <TableCell className={styles.heading}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? team.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : team
          ).map((member, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" className={styles.nameCol}>
                {userInfo.id == member.id ? <b>YOU</b> : member.name}
                <span className={styles.data}>Created {member.createdAt}</span>
              </TableCell>
              <TableCell className={styles.data}>{member.email}</TableCell>
              <TableCell className={styles.data}>
                <div className={styles.role}>
                  {member.role}
                  {userInfo.role == 'admin' && (
                    <DropdownMenu
                      menuItems={roles
                        .filter((role) => role !== member.role)
                        .map((role) => ({
                          text: role,
                          onClick: (e) => handleChangeRole(e, member),
                        }))}
                      direction={'right'}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className={styles.data}>
                {userInfo.role == 'admin' && member.id !== userInfo.id && (
                  <RiDeleteBinLine
                    style={{
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: 'red',
                    }}
                    onClick={() => handleRemoveMember(member)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <PaginationTable
              count={team.length}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
              items={team}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

TeamTable.propTypes = {
  team: PropTypes.array,
  setRemoveModalOpen: PropTypes.func,
  setChangeRoleModalOpen: PropTypes.func,
  setSelectedMember: PropTypes.func,
};

export default TeamTable;

import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Table.module.css';
import { camelToUppercase } from '../../utils/generalHelper';

export default function CustomTable({ fullData = [], headers = [], data = [] }) {
    const tableHeaders = fullData.length > 0
        ? Object.keys(fullData[0])
        : headers;

    const tableData = fullData.length > 0
        ? fullData.map(item => Object.values(item))
        : data;

    return (
        <TableContainer component={Paper} elevation={0} >
            <Table sx={{
                minWidth: 650,
                border: '1px solid #ddd',
            }}>
                <TableHead>
                    <TableRow className={styles.tableHeader}>
                        {tableHeaders.map((header, index) => (
                            <TableCell key={index} className={styles.heading}>{camelToUppercase(header)}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} className={styles.data}>
                                    {typeof cell === 'boolean' ? (
                                        cell ? <DoneIcon style={{ color: 'var(--checkIcon-green)' }} /> : <CloseIcon style={{ color: 'var(--red-500)' }} />
                                    ) : (
                                        cell
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

CustomTable.propTypes = {
  fullData: PropTypes.arrayOf(PropTypes.object),
  headers: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.array),
};

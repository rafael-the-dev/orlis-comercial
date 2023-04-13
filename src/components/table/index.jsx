import { useCallback, useMemo, useState } from "react"
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { v4 as uuidV4 } from "uuid";
import classNames from "classnames"

import { useTheme } from '@mui/material/styles';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
        >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="previous page"
        >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
        >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
        >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
        </Box>
  );
}

const Container = ({ classes, data, getBodyRows, headers }) => {
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(3);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);
    
    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const tableHeader = useMemo(() => (
        <TableHead>
            <TableRow className={classNames(classes?.tableHeaderRow)}>
                {
                    headers.current.map(header => (
                        <TableCell 
                            align="center"
                            className={classes?.tableHeadCell}
                            key={uuidV4()}>
                            { header.label }
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    ), [ classes, headers ]);

    return (
        <TableContainer className={classNames(classes?.root)}>
            <Table className={classNames(classes?.table, "border border-solid border-stone-300")} sx={{ minWidth: 500 }} aria-label="custom pagination table">
                { tableHeader }
                <TableBody>
                    { getBodyRows({ page, rowsPerPage }) }
                </TableBody>
                <TableFooter className={classNames(classes?.tableFooter)}>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[2, 3, 5, 7, 10, 15, 25, { label: 'All', value: -1 }]}
                            colSpan={headers.current.length}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                    </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default Container;
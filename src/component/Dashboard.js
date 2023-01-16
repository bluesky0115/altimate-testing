import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from "react-hook-form";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [rows, setRows ] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [status, setStatus] = React.useState('')
	const [filteruserid, setFilterUserId ] = React.useState('')
	const [filterStatus, setFilterStatus ] = React.useState('')
	const { register, setValue, handleSubmit } = useForm();
	
	React.useEffect(() => {
		if(filteruserid != '' && filterStatus !== '')
			fetch(`https://jsonplaceholder.typicode.com/todos?userId=${filteruserid}&&completed=${filterStatus}`)
			.then((response) => response.json())
			.then((json) => setRows(json))
		else if(filteruserid != '' && filterStatus === '')
			fetch(`https://jsonplaceholder.typicode.com/todos?userId=${filteruserid}`)
			.then((response) => response.json())
			.then((json) => setRows(json))
		else if(filteruserid == '' && filterStatus !== '') {
			fetch(`https://jsonplaceholder.typicode.com/todos?completed=${filterStatus}`)
			.then((response) => response.json())
			.then((json) => setRows(json))
		}
		else 
			fetch(`https://jsonplaceholder.typicode.com/todos`)
			.then((response) => response.json())
			.then((json) => setRows(json))
	}, [filteruserid, filterStatus])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

	const onSubmit = (data) => {
		fetch('https://jsonplaceholder.typicode.com/todos', {
			method: 'POST',
			body: JSON.stringify({
				title: data.title,
				userId: data.userId,
				completed: data.completed
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
		.then((response) => response.json())
		.then((json) => {
			setRows([...rows, json])
			setOpen(false)
		});
	}

	const onDelete = (id) => {
		fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
		.then((json) => {
			const newArr = rows.filter((val) => val.id !== id)
			setRows(newArr)
		})
	}

  return (
		<>
			<Box component="div" sx={{padding: '20px'}}>
				<Box component="div" sx={{display: 'flex', alignItems: 'center', justifyContent:'center', gap: '12px'}}>
					<TextField placeholder='User Id' value={filteruserid} onChange={(e) => setFilterUserId(e.target.value)}/>
					<FormControl sx={{width: '300px'}}>
						<InputLabel id="demo-simple-select-label">Completed Status</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={filterStatus}
							label="Completed Status"
							onChange={(e) => setFilterStatus(e.target.value)}
						>
							<MenuItem value={false}>false</MenuItem>
							<MenuItem value={true}>true</MenuItem>
						</Select>
					</FormControl>
					<Button variant="contained" onClick={() => setOpen(true)}>
						Add
					</Button>
				</Box>
				<Dialog
					open={open}
					onClose={() => setOpen(false)}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						Add Dialog
					</DialogTitle>
					<Box component="form" onSubmit={handleSubmit(onSubmit)}>
						<DialogContent>
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '20px',
							}}>
								<TextField placeholder='Title' {...register('title')}/>
								<TextField placeholder='User Id' {...register('userId')}/>

								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Completed Status</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={status}
										label="Completed Status"
										onChange={(e) => {
											setStatus(e.target.value)
											setValue('completed', e.target.value)
										}}
									>
										<MenuItem value={false}>false</MenuItem>
										<MenuItem value={true}>true</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</DialogContent>
						<DialogActions>
							<Button autoFocus type="submit">
								Save
							</Button>
							<Button onClick={() => setOpen(false)}>Cancel</Button>
						</DialogActions>
					</Box>
				</Dialog>
			</Box>
			<div>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
						<TableHead>
							<TableRow>
								<TableCell align="center">No</TableCell>
								<TableCell align="center">Title</TableCell>
								<TableCell align="center">User ID</TableCell>
								<TableCell align="center">Completed Status</TableCell>
								<TableCell align="center">Controls</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(rowsPerPage > 0
								? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								: rows
							).map((row, ind) => (
								<TableRow key={ind}>
									<TableCell align="center">{page * rowsPerPage + ind + 1}</TableCell>
									<TableCell component="th" scope="row" align="center">
										{row.title}
									</TableCell>
									<TableCell align="center">
										{row.userId}
									</TableCell>
									<TableCell align="center">
										{row.completed ? 'true' : 'false'}
									</TableCell>
									<TableCell align="center">
										<Button>Edit</Button>
										<Button onClick={() => onDelete(row.id)}>Delete</Button>
									</TableCell>
								</TableRow>
							))}

							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
									colSpan={3}
									count={rows.length}
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
			</div>
		</>
  );
}
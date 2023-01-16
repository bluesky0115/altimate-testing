import * as React from 'react';
import TablePaginationActions from './TablePagination'
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableHead, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddDialog from './AddDialog';
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';

export default function Dashboard() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [rows, setRows ] = React.useState([]);
	const [open, setOpen] = React.useState(0);
	const [filteruserid, setFilterUserId ] = React.useState('')
	const [filterStatus, setFilterStatus ] = React.useState('')
	const [selectItem, setSelectItem] = React.useState(null)

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
			setOpen(0)
		});
	}

	const onDelete = () => {
		fetch(`https://jsonplaceholder.typicode.com/todos/${selectItem.id}`, {
			method: 'DELETE',
		}).then((response) => response.json())
		.then((json) => {
			const newArr = rows.filter((val) => val.id !== selectItem.id)
			setSelectItem(null)
			setRows(newArr)
			setOpen(0)
		})
	}

	const onEdit = (data) => {
		fetch('https://jsonplaceholder.typicode.com/posts/1', {
			method: 'PUT',
			body: JSON.stringify({
				id: selectItem.id,
				title: data.title,
				userId: data.userId,
				completed: data.completed,
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		})
		.then((response) => response.json())
		.then((json) => {
			setSelectItem(null)
			const newArr = rows.filter((val) => {
				if(val.id == selectItem.id) {
					val.title = data.title
					val.userId = data.userId
					val.completed = data.completed
				}
				return val
			})
			setRows(newArr)
			setOpen(0)
		});
	}

  return (
		<>
			<Box component="div" sx={{padding: '20px'}}>
				<Box component="div" sx={{display: 'flex', alignItems: 'center', justifyContent:'center', gap: '12px'}}>
					<TextField placeholder='User Id' value={filteruserid} onChange={(e) => setFilterUserId(e.target.value)}/>
					<FormControl sx={{width: '250px'}}>
						<InputLabel id="demo-simple-select-label">Completed Status</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={filterStatus}
							label="Completed Status"
							onChange={(e) => setFilterStatus(e.target.value)}
						>
							<MenuItem value={''}>All</MenuItem>
							<MenuItem value={false}>false</MenuItem>
							<MenuItem value={true}>true</MenuItem>
						</Select>
					</FormControl>
					<Button variant="contained" onClick={() => setOpen(1)}>
						Add
					</Button>
				</Box>
				
				<AddDialog open={open} onClose={() => setOpen(0)} onSubmit={onSubmit}/>
			</Box>
			<Box component="div">
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
										<Button onClick={() => {
											setSelectItem(row)
											setOpen(3)}
										}>Edit</Button>
										<Button onClick={() => {
											setSelectItem(row)
											setOpen(2)}
										}>Delete</Button>
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
			</Box>
									
			<DeleteDialog open={open} onClose={() => setOpen(0)} onDelete={onDelete}/>
			<EditDialog open={open} onClose={() => setOpen(0)} selectItem={selectItem} onEdit={onEdit}/>

			<div className="App">
				<h1>GEEKSFORGEEKS BAR CHART REACTJS</h1>
				<div style={{ maxWidth: "650px" }}>
					<Bar
						data={{
							// Name of the variables on x-axies for each bar
							labels: ["1st bar", "2nd bar", "3rd bar", "4th bar"],
							datasets: [
								{
									// Label for bars
									label: "total count/value",
									// Data or value of your each variable
									data: [1552, 1319, 613, 1400],
									// Color of each bar
									backgroundColor: ["aqua", "green", "red", "yellow"],
									// Border color of each bar
									borderColor: ["aqua", "green", "red", "yellow"],
									borderWidth: 0.5,
								},
							],
						}}
						// Height of graph
						height={400}
						options={{
							maintainAspectRatio: false,
							scales: {
								yAxes: [
									{
										ticks: {
											// The y-axis value will start from zero
											beginAtZero: true,
										},
									},
								],
							},
							legend: {
								labels: {
									fontSize: 15,
								},
							},
						}}
					/>
				</div>
			</div>
		</>
  );
}
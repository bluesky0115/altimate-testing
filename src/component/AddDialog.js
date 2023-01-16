import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {TextField} from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';

const AddDialog = ({open, onClose, onSubmit}) => {
	const { register, setValue, handleSubmit, reset, resetField } = useForm();
	const [status, setStatus] = React.useState('')

	React.useEffect(() => {
		setStatus('')
		reset()
	}, [open])

	return (
		<Dialog
			open={open === 1}
			onClose={() => { 
				reset()
				onClose()}}
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
						<TextField placeholder='Title' {...register('title')} required/>
						<TextField placeholder='User Id' {...register('userId')} required/>

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
								required
							>
								<MenuItem value={false}>false</MenuItem>
								<MenuItem value={true}>true</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button autoFocus type="submit">
						Add
					</Button>
					<Button onClick={() => {
						reset()
						onClose()
					}}>Cancel</Button>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default AddDialog
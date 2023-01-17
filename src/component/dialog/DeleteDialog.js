import React from 'react'
import { useForm } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const DeleteDialog = ({open, onClose, onDelete}) => {

	return (
		<Dialog
			open={open == 2}
			onClose={() => onClose()}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			fullWidth
		>
			<DialogTitle id="alert-dialog-title">
				Delete Dialog
			</DialogTitle>
			<Box component="div">
				<DialogContent>
					Do you want to delete?
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={onDelete} variant="contained">
						Confirm
					</Button>
					<Button onClick={() => onClose()} variant="contained" color="error">Cancel</Button>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default DeleteDialog
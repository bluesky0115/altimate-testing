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

const DeleteDialog = ({open, onClose, onDelete}) => {

	return (
		<Dialog
			open={open == 2}
			onClose={() => onClose()}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				Delete Dialog
			</DialogTitle>
			<Box component="div">
				<DialogContent>
					Do you want to delete?
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={onDelete}>
						Confirm
					</Button>
					<Button onClick={() => onClose()}>Cancel</Button>
				</DialogActions>
			</Box>
		</Dialog>
	)
}

export default DeleteDialog
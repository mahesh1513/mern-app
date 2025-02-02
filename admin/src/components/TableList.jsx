import { React, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EditOrderModal from './EditOrderModal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import {API_URL} from '../utils/api';

export default function EnhancedTable() {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = useSelector((state) => state.auth.authToken);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (token) {
      getAllOrders();
    }
    
  }, [token]);

  const getAllOrders = async () => {

    setLoading(true); 
    try {

      const response = await axios.get(`${API_URL}/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAdd = () => {
    setSelectedOrderId('');
    setOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedOrderId(id);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedOrderId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteOrder = () => {
    axios.delete(`${API_URL}/orders/${selectedOrderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
      setRows(rows.filter((row) => row._id !== selectedOrderId));
      setConfirmDeleteOpen(false);
    })
    .catch(err => {
      console.error("Error deleting row", err);
      setConfirmDeleteOpen(false);
    });
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
  };

  const handleFileDownload = async (fileName) => {

    try {

      const response = await axios.get(`${API_URL}/orders/download/${fileName}`, {
        headers: { Authorization: `Bearer ${token}`},
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
            Purchase Orders
          </Typography>
          <IconButton>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Purchase Order(+)
            </Button>
          </IconButton>
        </Toolbar>
        {loading ? (  // Display loading indicator if data is being fetched
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Typography variant="h6">Loading...</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: 'center' }}>Product</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Quantity</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Price</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Supplier</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Date</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>File</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell sx={{ textAlign: 'center' }}>{row.product}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{row.quantity}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{row.price}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{row.supplier}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{new Date(row.date).toISOString().split('T')[0]}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{row.file}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                    {row.file && row.file !== "-" ? (
                        <IconButton onClick={() => handleFileDownload(row.file)} color="primary">
                          <DownloadIcon sx={{ marginRight: 1 }} />
                        </IconButton>
                      ) : (
                        <IconButton disabled sx={{ textDecoration: 'line-through' }}>
                          <DownloadIcon sx={{ marginRight: 1 }} />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleEdit(row._id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row._id)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <EditOrderModal
        open={open}
        setOpen={setOpen}
        orderId={selectedOrderId}
        token={token}
        onUpdate={() => {
          getAllOrders();
        }}
      />

      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">Cancel</Button>
          <Button onClick={confirmDeleteOrder} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

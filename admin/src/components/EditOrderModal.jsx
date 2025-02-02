import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';
import {API_URL} from '../utils/api';

function EditOrderModal({ open, setOpen, orderId, token, onUpdate }) {
  const [orderDetails, setOrderDetails] = useState({
    product: '',
    quantity: '',
    price: '',
    supplier: '',
    date: '',
    file: null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (orderId) {
      axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          setOrderDetails(response.data.data);
        })
        .catch(err => {
          console.error("Error fetching order data", err);
        });
    } 
  }, [orderId, open, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(selectedFile.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: 'Invalid file type. Only JPG and PNG files are allowed.',
        }));
        setFile(null);
      } else if (selectedFile.size > maxSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: 'File size exceeds 5MB limit.',
        }));
        setFile(null);
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, file: '' }));
        setFile(selectedFile); 
      }
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setErrors((prevErrors) => ({ ...prevErrors, file: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!orderDetails.product) newErrors.product = 'Product is required';
    if (!orderDetails.quantity || isNaN(orderDetails.quantity) || orderDetails.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!orderDetails.price || isNaN(orderDetails.price) || orderDetails.price <= 0) newErrors.price = 'Valid price is required';
    if (!orderDetails.supplier) newErrors.supplier = 'Supplier is required';
    if (!orderDetails.date) newErrors.date = 'Date is required';
    if (!file && errors.file) {
      newErrors.file = errors.file;
    }

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      const formData = new FormData();
      formData.append('product', orderDetails.product);
      formData.append('quantity', orderDetails.quantity);
      formData.append('price', orderDetails.price);
      formData.append('supplier', orderDetails.supplier);
      formData.append('date', orderDetails.date);
      if (file) {
        formData.append('file', file);
      }

      try {
        let response;
        if (orderId) {

          response = await axios.put(`${API_URL}/orders/${orderId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          });
          setSuccessMessage('Order updated successfully!');

        } else {

          response = await axios.post(`${API_URL}/orders/create`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          });
          setOrderDetails({
            product: '',
            quantity: '',
            price: '',
            supplier: '',
            date: '',
            file: null
          });
          setSuccessMessage('Order added successfully!');

        }
        onUpdate();

      } catch (error) {
        console.error('Error updating order', error);
        setSuccessMessage('Error saving order. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog open={open} onClose={() => { setOpen(false); setSuccessMessage(''); }}>
      {(orderId && orderId.trim() !== '') ? <DialogTitle>Edit Order</DialogTitle> : <DialogTitle>Add Order</DialogTitle>}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product"
            fullWidth
            margin="normal"
            name="product"
            value={orderDetails.product}
            onChange={handleChange}
            error={!!errors.product}
            helperText={errors.product}
          />
          <TextField
            label="Quantity"
            fullWidth
            margin="normal"
            name="quantity"
            value={orderDetails.quantity}
            onChange={handleChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
            type="number"
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            name="price"
            value={orderDetails.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            type="number"
          />
          <TextField
            label="Supplier"
            fullWidth
            margin="normal"
            name="supplier"
            value={orderDetails.supplier}
            onChange={handleChange}
            error={!!errors.supplier}
            helperText={errors.supplier}
          />
          <TextField
            label="Date"
            fullWidth
            margin="normal"
            name="date"
            value={formatDate(orderDetails.date)}
            onChange={handleChange}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.date}
            helperText={errors.date}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            disabled={loading}
            startIcon={<CloudUploadIcon />}
          >
            Choose File
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>
          {file && (
            <div style={{ marginTop: '10px' }}>
              <Typography variant="body2">{file.name}</Typography>
              <Button
                onClick={handleFileRemove}
                color="secondary"
                size="small"
                style={{ marginTop: '5px' }}
              >
                Remove File
              </Button>
            </div>
          )}
          {errors.file && <Typography color="error">{errors.file}</Typography>}
          
          {successMessage && (
            <Typography color="success" style={{ marginTop: '10px' }}>
              {successMessage}
            </Typography>
          )}
          <DialogActions>
            <Button onClick={() => { setOpen(false); setSuccessMessage(''); }} color="secondary">Close</Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditOrderModal;

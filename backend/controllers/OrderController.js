const express = require('express');
const bcrypt = require('bcryptjs');
const Order = require('../models/orderModel');
const path = require('path');
const fs = require('fs');

const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.userid; 
    const data = await Order.find({ userId }); 
    return res.json({ data: data, message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const findOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const userId = req.user.userid;
    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found or you do not have permission to access it!" });
    }

    return res.json({ data: order, message: "Order found successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch order!" });
  }
};

const createOrder = async (req, res) => {
  let fileName = null;
  if (req.file) {
    fileName = req.file.filename;
  }

  try {
    const userId = req.user.userid;
    const order = new Order({
      product: req.body.product,
      quantity: req.body.quantity,
      price: req.body.price,
      supplier: req.body.supplier,
      date: req.body.date,
      file: fileName || "-",
      userId: userId
    });

    await order.save();
    console.log('Order saved');
    return res.status(200).json({ message: "Order created!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Order not created!" });
  }
};

const updateOrder = async (req, res) => {

  const { id } = req.params;
  const { product, quantity, price, supplier, date } = req.body;
  let updateObj = { product, quantity, price, supplier, date };
  let fileName = null;
  if (req.file) {
    fileName = req.file.filename;
    updateObj = { ...updateObj,file: fileName };
  }

  try {
    
    const userId = req.user.userid; 
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, userId },
      {...updateObj},
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found or you do not have permission to update it!" });
    }

    return res.json({ message: "Order updated successfully!", data: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update order!" });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const userId = req.user.userid;
    const deletedOrder = await Order.findOneAndDelete({ _id: id, userId });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found or you do not have permission to delete it!" });
    }

    return res.json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete order!" });
  }
};

const downloadFile = async (req, res) => {

    const { fileName } = req.params;
    const userId = req.user.userid;
  
    try {

      const order = await Order.findOne({ file: fileName, userId });
      if (!order) {
        return res.status(403).json({ message: "You are not authorized to download this file." });
      }
      const filePath = path.join(__dirname,'..','uploads', fileName);
      if (fs.existsSync(filePath)) {
        res.download(filePath, fileName, (err) => {
          if (err) {
            return res.status(500).send('Error downloading the file.');
          }
        });
      } else {
        return res.status(404).send('File not found');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error processing the request." });
    }

  };
  
module.exports = {
  createOrder, 
  getAllOrders, 
  updateOrder, 
  deleteOrder, 
  findOrderById, 
  downloadFile 
};

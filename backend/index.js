const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://127.0.0.1:27017/mern-task")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Product = mongoose.model("Product", ProductSchema);


app.post("/products", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price required" });
    }

    const product = new Product({ name, price });
    const saved = await product.save();

    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});


app.delete("/delete-invalid", async (req, res) => {
  await Product.deleteMany({ name: { $exists: false } });
  res.send("Invalid data deleted");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
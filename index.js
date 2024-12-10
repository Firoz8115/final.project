const express = require('express');
const mongoose = require('mongoose');
const app = express();
//const Product = require('./models/product');



app.use(express.json());
app.use(express.urlencoded({extended: true}));

 const productsSchema = new mongoose.Schema({
  title:String,
  price:Number,
  description:String,
  createdAt:{
    type:Date, 
    default:Date.now
  },
});

const Product = mongoose.model("Product",productsSchema);

app.post("/products", async (req,res)=>{
   try {
     
     const newProduct = new Product({
      title: req.body.title,
      price:req.body.price,
      description: req.body.description,
    });

    const productData = await newProduct.save();
  
     res.status(201).send(productData);

   } catch (error) {
    res.status(500).send({message:error.message});
   }
});

  
const connectDB = async  () =>{
   try {
      mongoose.connect("mongodb://127.0.0.1:27017/test_product");
    await  console.log("db is connected");
   } catch (error) {
    console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
   }
    
    
};


app.listen(3002, async ()=>{
    console.log("server is running at htttp//localhost:3000")
    await connectDB();
});
app.get("/",(req,res)=>{
    res.send("THIS IS MY SERVER RUNNING");
});




app.get("/products", async (req,res)=>{
    try {
        const products = await Product.find({})
        res.status(200).json(products);
    } catch (error) {
      res.status(500).json({message:error.message});   
    }
});

 
app.get("/products/:id", async (req,res)=>{
  try {
       const {id} = req.params;
       const product = await Product.findById(id);
       res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message:error.message});   
  }
});

app.put('/product/:id', async (req,res)=>{
  try {
      const {id} = req.params;
      const produc = await Product.findByIdAndUpdate(id,req.body);
      if(!produc){
        return res.status(404).json({message:'product not found'});
      }
      const updatedproduct = await Product.findById(id); 
      res.status(200).json(updatedproduct);
  } catch (error) {
    res.status(500).json({message:error.message});   
  }
});

app.delete('/product/:id', async (req,res)=>{
  try {
    const {id} = req.params;
    const process = await Product.findByIdAndDelete(id);
    if(!process){
      return res.status(404).json({message:'product not deleted'});
    }
    res.status(200).json({message:'deleted succesfully'});
  } catch (error) {
    res.status(500).json({message:error.message});
  }
});

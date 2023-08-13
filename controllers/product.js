import Product from "../Models/product.js";
import Cart from "../Models/cart.js"
import mongoose from 'mongoose';

export const getMoreData = async (req, res) => {
  const page = req.query.page;
  console.log(page);
  const skip = (page - 1) * 5;
  const data = await Product.find().skip(skip).limit(5);
  res.json(data);
};

export const getCart = async (req, res)=>{
      const loggedIn = req.session.loggedIn;
      const username = req.session.username;
      const profile = req.session.profile;
     
      try {
        const productsArray = await Cart.find();
        const productsId = productsArray.map((item) => item.productId);
        
        const finalData = await Product.find({
          _id: { $in: productsId }
        });
        
        req.session.loggedIn
            ? res.render('cart', {loggedIn, username, profile, finalData})
            : res.redirect("/users/login")

      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
      
}

export const addToCart = async (req, res)=>{
  const itemId = req.query.itemId;
  const response = await Cart.create({
    productId: itemId
  })
  console.log(response);
  res.send("Added")
}


export const deleteProduct = async (req, res) => {
  const itemId = req.query.itemId;
  
  try {
    const response = await Cart.deleteOne({productId: itemId});
    console.log(response);

    res.send("data deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product from cart.' });
  }
};



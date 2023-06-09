import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // clear all three collections out completely
    // returns a promise
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // import users 
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // add admin user to each product 
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // import all the product data including the admin user
    await Product.insertMany(sampleProducts);

    console.log("================\nData Imported!\n================");
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
  DeletedProduct,
  UpdateProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getCheckedProduct,
  getLatestProduct,
  getSingleProduct,
  newProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", isAdmin, singleUpload, newProduct);
app.get("/latest", getLatestProduct);
app.get("/getAllProducts", getCheckedProduct)
app.get("/all", getAllProducts);



// category Routes
app.get("/getAllCategories", getAllCategories);
app.get("/admin-products", isAdmin, getAdminProducts);
app
  .route("/:id")
  .get(getSingleProduct)
  .put(singleUpload, isAdmin, UpdateProduct)
  .delete(isAdmin, DeletedProduct);


export default app;






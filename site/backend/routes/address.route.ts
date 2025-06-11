import express from "express";
import { addAddress, getAddresses, deleteAddress, editAddress } from "../controllers/address.controller";
import { requireAuth } from "../middleware/auth.middleware";

const addressRouter = express.Router();
addressRouter.use(requireAuth)

addressRouter.post("/create", addAddress);
addressRouter.get("/", getAddresses);
addressRouter.put("/:id", editAddress)
addressRouter.delete("/:id", deleteAddress);

export default addressRouter;

import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

const AddressSchema = new Schema<IAddress>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  zipCode: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IAddress>("Address", AddressSchema);

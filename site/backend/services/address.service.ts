import Address from "../models/address.model";

export const createAddress = (userId: string, data: any) => {
  return Address.create({ ...data, user: userId });
};

export const getUserAddresses = (userId: string) => {
  return Address.find({ user: userId });
};

export const editUserAddress = (idAddress: string, data: any) => {
  return Address.findByIdAndUpdate(idAddress, data, { new: true });
};

export const deleteUserAddress = (addressId: string, userId: string) => {
  return Address.findOneAndDelete({ _id: addressId, user: userId });
};

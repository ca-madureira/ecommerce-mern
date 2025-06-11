import { Request, Response } from "express";
import { createAddress, getUserAddresses, deleteUserAddress, editUserAddress } from "../services/address.service";

export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    console.log(userId)
    const address = await createAddress(userId, req.body);
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: "Erro ao adicionar endereço" });
  }
};

export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const addresses = await getUserAddresses(userId);
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar endereços" });
  }
};

export const editAddress = async (req: Request, res: Response) => {
  try {
    const idAddress = req.params.id;
    const updatedAddress = await editUserAddress(idAddress, req.body);
    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ message: "Erro ao editar endereço" });
  }
};


export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const addressId = req.params.id;
    await deleteUserAddress(addressId, userId);
    res.status(200).json({ message: "Endereço removido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar endereço" });
  }
};

import { useEffect, useState } from "react";
import { ModalAddress } from "../components/ModalAddress";
import axios from "axios";
import { AddressCard } from "../components/AddressCard";
import { Address } from "../types";

export const MyAddress = () => {
  const [openModal, setOpenModal] = useState(false);
  const [listAddresses, setListAddresses] = useState<Address[]>([]);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const token = localStorage.getItem("token") || "";

  const getAddresses = () => {
    axios
      .get("http://localhost:4000/api/user/address/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListAddresses(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar endereços:", error);
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:4000/api/user/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setListAddresses((prev) => prev.filter((addr) => addr._id !== id));
      })
      .catch((error) => {
        console.error("Erro ao excluir endereço:", error);
      });
  };

  const handleEdit = (address: Address) => {
    setEditAddress(address);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditAddress(null);
    getAddresses();
  };

  useEffect(() => {
    getAddresses();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <section className="max-w-3xl w-full mx-auto flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">Meus endereços</h1>
        <button
          onClick={() => {
            setEditAddress(null);
            setOpenModal(true);
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded shadow"
        >
          + Adicionar
        </button>
      </section>

      <section className="max-w-3xl w-full mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-zinc-700">Endereços</h2>
        {listAddresses.length > 0 ? (
          <ul className="space-y-4">
            {listAddresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        ) : (
          <p className="text-zinc-600">Nenhum endereço cadastrado.</p>
        )}
      </section>

      {openModal && (
        <ModalAddress
          openModal={openModal}
          setOpenModal={handleCloseModal}
          editAddress={editAddress}
        />
      )}
    </main>
  );
};

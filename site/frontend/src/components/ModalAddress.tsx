import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Address } from "../types";

interface Props {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  editAddress: Address | null
}

interface IDataAddress {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const ModalAddress = ({ openModal, setOpenModal, editAddress }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);

  const [dataAddress, setDataAddress] = useState<IDataAddress>({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  useEffect(() => {
    if (editAddress) {
      setDataAddress({
        zipCode: editAddress.zipCode,
        street: editAddress.street,
        number: editAddress.number,
        complement: editAddress.complement,
        neighborhood: editAddress.neighborhood,
        city: editAddress.city,
        state: editAddress.state,
      });
    } else {
      setDataAddress({
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    }
  }, [editAddress]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDataAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveDataAddress = (e: FormEvent) => {
    e.preventDefault();

    const url = editAddress
      ? `http://localhost:4000/api/user/address/${editAddress._id}`
      : "http://localhost:4000/api/user/address/create";

    const method = editAddress ? "put" : "post";

    axios({
      method,
      url,
      data: dataAddress,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Endereço salvo:", res.data);
        setOpenModal(false);
      })
      .catch((err) => {
        console.error("Erro ao salvar endereço:", err);
      });
  };

  return (
    <section className="flex justify-center items-center fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={saveDataAddress}
        className="bg-white px-6 pt-4 pb-6 rounded-lg shadow-2xl relative"
      >
        <button
          type="button"
          onClick={() => setOpenModal(!openModal)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 cursor-pointer"
          aria-label="Fechar modal"
        >
          ×
        </button>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-lg font-medium text-teal-700 mb-2">{editAddress ? "Editar endereço" : "Novo endereço"}</legend>


          <div className="flex flex-col">
            <label htmlFor="cep" className="text-zinc-800 mb-1">CEP:</label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={dataAddress.zipCode}
              onChange={handleChange}
              className="w-full outline-none border border-zinc-300 p-2 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="street" className="text-zinc-800 mb-1">Rua:</label>
            <input
              type="text"
              name="street"
              id="street"
              value={dataAddress.street}
              onChange={handleChange}
              className="w-full outline-none border border-zinc-300 p-2 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="number" className="text-zinc-800 mb-1">Número:</label>
            <input
              type="text"
              name="number"
              id="number"
              value={dataAddress.number}
              onChange={handleChange}
              className="w-full outline-none border border-zinc-300 p-2 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="complement" className="text-zinc-800 mb-1">Complemento:</label>
            <input
              type="text"
              name="complement"
              id="complement"
              value={dataAddress.complement}
              onChange={handleChange}
              className="w-full outline-none border border-zinc-300 p-2 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="neighborhood" className="text-zinc-800 mb-1">Bairro:</label>
            <input
              type="text"
              name="neighborhood"
              id="neighborhood"
              value={dataAddress.neighborhood}
              onChange={handleChange}
              className="w-full outline-none border border-zinc-300 p-2 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="city" className="text-zinc-800 mb-1">Cidade:</label>
              <input
                type="text"
                name="city"
                id="city"
                value={dataAddress.city}
                onChange={handleChange}
                className="w-full outline-none border border-zinc-300 p-2 rounded focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="state" className="text-zinc-800 mb-1">Estado:</label>
              <select
                id="state"
                name="state"
                value={dataAddress.state}
                onChange={handleChange}
                required
                className="w-full border border-zinc-300 p-2 rounded outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="">Selecione o estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded transition-colors"
          >
            {editAddress ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </form>
    </section>
  );
};

import { Address } from "../types"
import { FiEdit, FiTrash2 } from "react-icons/fi"

interface AddressCardProps {
  address: Address
  onEdit?: (address: Address) => void
  onDelete?: (id: string) => void
}

export const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  return (
    <article className="w-full border border-teal-500 bg-white hover:bg-teal-50 p-4 rounded-lg shadow flex justify-between items-start">
      <div>
        <p>
          <strong className="text-teal-600">Rua:</strong> {address.street}, {address.number}
        </p>
        <p>
          <strong className="text-teal-600">Cidade:</strong> {address.city} - {address.state}
        </p>
        <p>
          <strong className="text-teal-600">CEP:</strong> {address.zipCode}
        </p>
      </div>

      <div className="flex gap-3 mt-1">
        <button onClick={() => onEdit?.(address)} title="Editar">
          <FiEdit className="text-teal-600 hover:text-teal-800 w-5 h-5" />
        </button>
        <button onClick={() => onDelete?.(address._id)} title="Excluir">
          <FiTrash2 className="text-red-500 hover:text-red-700 w-5 h-5" />
        </button>
      </div>
    </article>
  )
}

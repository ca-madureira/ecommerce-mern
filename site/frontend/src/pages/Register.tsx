import { useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { GiShoppingBag } from "react-icons/gi";
import { CiDeliveryTruck } from "react-icons/ci";

export const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const CreateAccount = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        await axios.post("http://localhost:4000/api/user/register", { name, email, password })
            .then(() => {
                setName("")
                setEmail("")
                setPassword("")
                setLoading(false)
                alert("criado com sucesso")
            }).catch(() => {
                console.log("Deu erro")
            })
    }

    return (
        <section className="bg-teal-100 h-screen flex items-center justify-center bg-gradient-to-l from-emerald-100 to-teal-500">
            <section className="bg-white shadow-md w-[350px] h-[490px] rounded-md">
                <div className="flex items-center justify-center mt-6 gap-4"> <h1 className="text-teal-400 font-semibold text-2xl">Registre-se</h1><GiShoppingBag className="text-teal-400 w-8 h-8" /></div>


                <div className="bg-teal-200 h-8 mx-4 rounded-md marquee-container flex items-center mt-4">
                    <div className="marquee-content flex items-center gap-2 text-teal-800">
                        <CiDeliveryTruck className="w-6 h-6" />
                        <span className="text-sm italic font-semibold">Entregamos em todo o Brasil</span>
                    </div>
                </div>
                <form className="space-y-6 px-6" onSubmit={CreateAccount}>
                    <fieldset className="flex flex-col space-y-2">
                        <legend></legend>
                        <label className="text-teal-400 font-semibold">Nome:</label>
                        <input type="text" placeholder="user" className="border-2 border-teal-200 rounded-md outline-none h-12 p-2" value={name} onChange={(e) => setName(e.target.value)} />

                        <label className="text-teal-400 font-semibold">E-mail:</label>
                        <input type="email" placeholder="user@mail.com" className="border-2 border-teal-200 rounded-md outline-none h-12 p-2" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label className="text-teal-400 font-semibold">Senha:</label>
                        <input type="password" placeholder="********" className="border-2 border-teal-200 rounded-md outline-none h-12 p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </fieldset>
                    <footer>
                        <button type="submit" className="w-full rounded-md p-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold cursor-pointer h-12">
                            {loading ? 'Carregando...' : 'Entrar'}
                        </button>
                        <p className="text-sm">Já tem conta? <Link className="text-sky-500 font-semibold" to="/login">Login</Link></p>
                    </footer>

                </form>
            </section>
        </section>

    )
}
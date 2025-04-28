import { useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

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
        <section className="bg-teal-100 h-screen flex items-center justify-center">
            <section className="bg-white shadow-md w-[350px] h-[450px] rounded-md">
                <h1 className="text-teal-400 font-semibold text-center text-2xl mt-6">Crie sua conta</h1>
                <form className="space-y-6 px-6" onSubmit={CreateAccount}>
                    <fieldset className="flex flex-col space-y-2">
                        <legend></legend>
                        <label className="text-teal-400 font-semibold">Nome:</label>
                        <input type="text" className="border-2 border-teal-200 rounded-md outline-none h-12" value={name} onChange={(e) => setName(e.target.value)} />

                        <label className="text-teal-400 font-semibold">E-mail:</label>
                        <input type="email" className="border-2 border-teal-200 rounded-md outline-none h-12" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label className="text-teal-400 font-semibold">Senha:</label>
                        <input type="password" className="border-2 border-teal-200 rounded-md outline-none h-12" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </fieldset>
                    <footer>
                        <button type="submit" className="w-full rounded-md p-2 bg-teal-300 hover:bg-teal-200 text-white font-semibold cursor-pointer h-12">
                            {loading ? 'Carregando...' : 'Entrar'}
                        </button>
                        <p className="text-sm">Já tem conta? <Link className="text-sky-500 font-semibold" to="/login">Login</Link></p>
                    </footer>

                </form>
            </section>
        </section>

    )
}
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useState, FormEvent } from "react"
import axios from "axios"
import { toast } from "react-toastify"

interface LoginProps {
    setToken: (token: string) => void;
}

export const Login = ({ setToken }: LoginProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        axios
            .post("http://localhost:4000/api/user/login", { email, password })
            .then((response) => {
                if (response.data.success) {
                    setToken(response.data.token)
                    toast.success("Fez login")
                    navigate("/")
                } else {
                    toast.error(response.data.message)
                }
            })
            .catch((error) => {
                toast.error(error.message)
            })
    }


    return (
        <section className="bg-teal-100 h-screen flex items-center justify-center">
            <section className="bg-white shadow-md h-[400px] w-[350px] rounded-md space-y-6">
                <h1 className="text-teal-400 font-semibold text-center text-2xl mt-6">Entre com sua conta</h1>
                <form className="space-y-6 px-6" onSubmit={onSubmitHandler}>
                    <fieldset className="flex flex-col space-y-2">
                        <label className="text-teal-400 font-semibold">E-mail:</label>
                        <input
                            type="email"
                            className="border-2 border-teal-200 rounded-md outline-none h-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className="text-teal-400 font-semibold">Senha:</label>
                        <input
                            type="password"
                            className="border-2 border-teal-200 rounded-md outline-none h-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </fieldset>
                    <footer>
                        <button type="submit" className="w-full rounded-md p-2 bg-teal-300 hover:bg-teal-200 text-white font-semibold cursor-pointer h-12">
                            Entrar
                        </button>
                        <p className="text-sm">Ainda não cadastrou sua conta? <Link to="/register" className="text-sky-500 font-semibold">Criar conta</Link></p>
                    </footer>
                </form>
            </section>
        </section>
    )
}

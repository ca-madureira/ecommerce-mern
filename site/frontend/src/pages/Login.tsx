import { Link, useNavigate } from "react-router-dom"
import { useState, FormEvent } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { CiDeliveryTruck } from "react-icons/ci";
import { GiShoppingBag } from "react-icons/gi";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/authSlice";

interface LoginProps {
    setToken: (token: string) => void;
}

export const Login = ({ setToken }: LoginProps) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const dispatch = useAppDispatch();

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        axios
            .post("http://localhost:4000/api/user/login", { email, password })
            .then((response) => {
                if (response.data.success) {
                    setToken(response.data.token)
                    // Make sure response.data.user exists before accessing properties
                    if (response.data.user && response.data.user.name) {
                        dispatch(setUser({
                            name: response.data.user.name,
                            email: response.data.user.email || email
                        }));
                    } else {
                        // Fallback if user object is incomplete
                        dispatch(setUser({ name: "User", email }));
                    }
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
        <section className="h-screen flex items-center justify-center bg-gradient-to-r from-emerald-100 to-teal-500">
            <section className="bg-white shadow-md h-[447px] w-[350px] rounded-md space-y-6">

                <div className="flex items-center justify-center mt-4 gap-4"> <h1 className="text-teal-400 font-semibold text-2xl">Faça Login</h1><GiShoppingBag className="text-teal-400 w-8 h-8" /></div>


                <div className="bg-teal-200 h-8 mx-4 rounded-md marquee-container flex items-center">
                    <div className="marquee-content flex items-center gap-2 text-teal-800">
                        <CiDeliveryTruck className="w-6 h-6" />
                        <span className="text-sm italic font-semibold">Frete grátis acima de R$500,00</span>
                    </div>
                </div>

                <form className="space-y-6 px-6" onSubmit={onSubmitHandler}>
                    <fieldset className="flex flex-col space-y-2">
                        <label className="text-teal-400 font-semibold">E-mail:</label>

                        <input
                            type="email"
                            className="border-2 border-teal-200 rounded-md outline-none h-12 p-2"
                            placeholder="user@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className="text-teal-400 font-semibold">Senha:</label>

                        <input
                            type="password"
                            className="border-2 border-teal-200 rounded-md outline-none h-12 p-2"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </fieldset>
                    <footer>
                        <button type="submit" className="w-full rounded-md p-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold cursor-pointer h-12">
                            Entrar
                        </button>
                        <p className="text-sm">Ainda não cadastrou sua conta? <Link to="/register" className="text-sky-500 font-semibold">Cadastre-se</Link></p>
                    </footer>
                </form>
            </section>
        </section>
    )
}
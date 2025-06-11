import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiShoppingBag } from "react-icons/gi";
import { useAppDispatch } from "../store/hooks";
import { setUser, setToken } from "../store/slices/authSlice";

interface LoginProps {
    setAppToken: (token: string) => void;
}

export const Login = ({ setAppToken }: LoginProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios
            .post("http://localhost:4000/api/user/login", { email, password })
            .then((response) => {
                if (response.data.success) {
                    const token = response.data.token;
                    const user = {
                        name: response.data.user.name,
                        email: response.data.user.email,
                    };

                    dispatch(setUser(user));
                    dispatch(setToken(token));

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    setAppToken(token);

                    toast.success("Fez login com sucesso");
                    navigate("/");
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    return (
        <section className="h-screen flex items-center justify-center bg-gradient-to-r from-emerald-100 to-teal-500">
            <section className="bg-white shadow-md h-[447px] w-[350px] rounded-md space-y-6">
                <div className="flex items-center justify-center mt-4 gap-4">
                    <h1 className="text-teal-400 font-semibold text-2xl">Faça Login</h1>
                    <GiShoppingBag className="text-teal-400 w-8 h-8" />
                </div>

                <div className="bg-teal-200 h-8 mx-4 rounded-md flex items-center justify-center">
                    <CiDeliveryTruck className="w-6 h-6 mr-2 text-teal-800" />
                    <span className="text-sm italic font-semibold text-teal-800">
                        Frete grátis acima de R$500,00
                    </span>
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
                        <button
                            type="submit"
                            className="w-full rounded-md p-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold cursor-pointer h-12"
                        >
                            Entrar
                        </button>
                        <p className="text-sm mt-2">
                            Ainda não cadastrou sua conta?{" "}
                            <Link to="/register" className="text-sky-500 font-semibold">
                                Cadastre-se
                            </Link>
                        </p>
                    </footer>
                </form>
            </section>
        </section>
    );
};

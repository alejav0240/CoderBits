import { useMutation } from '@tanstack/react-query'
import { postLogin } from '../api/authService.js'
import {useAuth} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

export const useLogin = () => {
    const { login } = useAuth()
    const navigate = useNavigate();
    return useMutation({
        mutationFn: postLogin,
        onSuccess: (res) => {
            login(res)
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
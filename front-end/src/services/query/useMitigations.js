import { useMutation } from '@tanstack/react-query'
import { getMitigaciones } from '../api/mitigationService.js'
import {useAuth} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router";

export const useMitigaciones = () => {
    return useMutation({
        mutationFn: getMitigaciones,
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
import { useMutation } from "@tanstack/react-query";
import { postActiveTraffic } from "../api/traficActiveServices";
import { toast } from "react-toastify";

export const useActiveTraffic = () => {
    return useMutation({
        mutationFn: postActiveTraffic,
        onSuccess: (res) => {
            toast.success(res.message);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

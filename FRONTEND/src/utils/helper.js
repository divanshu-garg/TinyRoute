import { useSelector } from "react-redux";
import { getCurrentUser } from "../api/user.api";
import { login } from "../store/slices/authSlice";
import { redirect } from "@tanstack/react-router";

// when user clicks on dashboard route, this function will be called to check if user is authenticated. if token expires and user is logged in he will stay logged in until he navigates to dashboard again via reload hence calling this checkAuth function
export const checkAuth = async ({context}) => {
    try {
        const store = context.store;
        const queryClient = context.queryClient;
        const user = await queryClient.ensureQueryData({
            queryKey: ['currentUser'],
            queryFn: getCurrentUser,
        })
        if(!user) return false;
        store.dispatch(login(user))
        const {isAuthenticated} = store.getState().auth;
        if(!isAuthenticated) return false;
        else return true;
    } catch (error) {
        console.log("error in auth check:", error);
        return redirect({to:"/auth"})
    }
}
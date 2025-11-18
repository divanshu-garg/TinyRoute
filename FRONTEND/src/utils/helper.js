import { useSelector } from "react-redux";
import { getCurrentUser } from "../api/user.api";
import { login } from "../store/slices/authSlice";
import { redirect } from "@tanstack/react-router";

// when user clicks on dashboard route, this function will be called to check if user is authenticated. if token expires and user is logged in he will stay logged in until he navigates to dashboard again via reload hence calling this checkAuth function
export const checkAuth = async ({context}) => {
    const queryClient = context.queryClient;
    try {
        const store = context.store;
        const user = await queryClient.ensureQueryData({
            queryKey: ['currentUser'],
            queryFn: getCurrentUser,
        })
        //  below line caused major logout button bug. because user always comes out to be truthy value
        if(!user?.user?._id)  throw redirect({ to: "/auth" });
        store.dispatch(login(user))
        const {isAuthenticated} = store.getState().auth;
        if(!isAuthenticated) throw redirect({ to: "/auth" });
        return;
    } catch (error) {
        // important step to clear cached user data on logout to prevent old data still showing issues on navBar
        await queryClient.removeQueries({ queryKey: ["currentUser"] });
        console.log("error in auth check:", error);
        throw redirect({to:"/auth"})
    }
}
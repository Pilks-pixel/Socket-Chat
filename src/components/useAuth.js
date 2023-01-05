
export function useAuth() {

    const user = localStorage.getItem("jwtToken");

    if (user) {
        return true
    } else {
        return false
    }

}
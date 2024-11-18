import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {//essayer d'envoyer une requete au path "api/token/refresh/", pour voir si il nous redonne un nouveau ACCESS_TOKEN
            const res = await api.post("api/user/token/refresh/", {refresh : refreshToken});
            if (res.status === 200) {//200 signifie que la reponse est favorable, le "===": comparaison tres tres strictement egal
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            }
            else {
                setIsAuthorized (false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);//recupere le token et verifie son existance
        if(!token) {
            setIsAuthorized(false);
            return;
        }

        const decode = jwtDecode(token);//decode le token pour avoir les info desssu
        const tokenExp = decode.exp;
        const now = Date.now() / 1000;

        if (tokenExp < now){//si le token existe, regarde si il est pas expirer
            await refreshToken();
        }
        else {
            setIsAuthorized(true);
        }
    }

    if (isAuthorized == null) {
        return <div>Chargement...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />//si "isAuthorized" == false, reenvoie l'utilisateur sur la page de login
}

export default ProtectedRoute
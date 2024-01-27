"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "../../components/ui/use-toast"
import JSEncrypt from "jsencrypt";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAwsGUHSWD0d3yEM2W1isO
ZU5OZhFDyg96V0Srvt1pO8O0UbwVEO+M2ra61CR2Dw+0Fm54OjYo2UySdS2iSOp2
YPLVBP3JvToZUK5ajLJWkR9lOvKMey51lhioUQqZLz1TsdkTYYIPLluIhk/QejCC
uNzNyEdS0Q1QGvSm8PRLNmigusrsjejKlvJvBKugR2KmTDEQGhFMU+ikpqPBh2HZ
G9e5UPACkXIjfmfW6zE6m9hHiXKUrDtuDtiNBHZQCb06n/Rl5cRCzwKI8U95IsoB
LdNJzmQ7B8sXLHhKArH5EcoQJ/m/eGW1BpTMMXFS/Hyw+jF/RHZbarmol2AAleOb
x8lFDTawbmfBb9QbUz1hJ4qy5E+Gmk5dqvh9G25L54rs3UWDJiCJtReIr6JmOZa2
zffnv3rVGpF01EDF2ySB72/uWgv487Qe0ExtZ2QLS+8rx1bJRqC4uX7lERAUVt9V
nC83PvUNw8xTnLWCaqrtQXHaShzNwGzKuVICKM2M0u9LAgMBAAE=
-----END PUBLIC KEY-----`;

const useLoginState = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    return { username, password, setPassword, isLoading, setIsLoading, handleUsernameChange, handlePasswordChange };
};

const useCookie = (name, initialValue) => {
    useEffect(() => {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
        if (cookieValue) {
            setLoginHash(cookieValue);
        }
    }, []);

    const setLoginHash = useCallback((hash) => {
        document.cookie = `${name}=${hash};expires=${new Date(Date.now() + 864e5).toUTCString()};path=/`;
    }, []);

    return setLoginHash;
};

export default function Login() {
    const { toast } = useToast()
    const { username, password, setPassword, isLoading, setIsLoading, handleUsernameChange, handlePasswordChange } = useLoginState();
    const setLoginHash = useCookie('loginHash');

    const login = useCallback((e) => {
        e.preventDefault();
        setIsLoading(true);

        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        const encryptedPassword = encrypt.encrypt(password);

        fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, encryptedPassword }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.loginHash) {
                setLoginHash(data.loginHash);
                toast({
                    description: `Welcome back, ${data.studentName}!`,
                  })
                // redirect to main page in 1 sec
                setTimeout(() => {
                    window.location.href = "/main";
                }, 1000);
            } else if (data.error) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                })
            }
        })
        .finally(() => setIsLoading(false));
    }, [username, password, setIsLoading, setLoginHash]);

    const buttonContent = useMemo(() => (
        isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'login'
    ), [isLoading]);

    return (
        <div className="w-11/12">
            <h1 className="font-bold text-3xl text-gray-200">login</h1>
            <form onSubmit={login} className="flex flex-col mt-4">
                <label className="text-gray-200">for security reasons bettervue is no longer able to be used. contact colebanman@gmail.com for any questions.</label>
                {/* <Input className="border-2 rounded-md" type="text" value={username} onChange={handleUsernameChange} />
                <label className="text-gray-200">password</label>
                <Input className="border-2 rounded-md" type="password" value={password} onChange={handlePasswordChange} />
                <Button className="rounded-md mt-4 btn" disabled={isLoading}>
                    {buttonContent}
                </Button> */}
            </form>
        </div>
    );
}


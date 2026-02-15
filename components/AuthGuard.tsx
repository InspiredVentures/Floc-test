import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const navigate = useNavigate();
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) {

            navigate('/login');
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-background-dark flex items-center justify-center">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return children;
};

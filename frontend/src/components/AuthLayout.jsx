import React from 'react';
import bgImage from '../assets/login-background.png';

const AuthLayout = ({ children, title }) => {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center
                       bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})`
            }}
        >
            {children}
        </div>
    );
};

export default AuthLayout;
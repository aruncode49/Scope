const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex justify-center mt-14 mb-10 lg:mt-20">
            {children}
        </div>
    );
};

export default AuthLayout;

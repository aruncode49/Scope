const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="dotted-background flex justify-center py-14">
            {children}
        </div>
    );
};

export default AuthLayout;

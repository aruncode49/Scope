import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
    return <SignUp path={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL} />;
};

export default SignUpPage;

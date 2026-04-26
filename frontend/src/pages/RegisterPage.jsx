import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/RegisterForm.jsx';

const RegisterPage = () => (
    <AuthLayout title="Đăng nhập/Đăng ký">
        <LoginForm />
    </AuthLayout>
);

export  default RegisterPage;
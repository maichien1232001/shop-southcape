import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useLoginMutation } from '../../store/services/rtkQueryStoreApi';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { RootState } from '../../../store';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginApi, { isLoading }] = useLoginMutation();

  // Lấy locale hiện tại để đa ngôn ngữ hóa trang Login
  const { locale } = useSelector((state: RootState) => state.locale);

  // Đường dẫn chuyển hướng sau khi đăng nhập thành công
  const redirect = searchParams.get('redirect') || '/';

  const labels: Record<string, Record<string, string>> = {
    title: { vi: 'ĐĂNG NHẬP TÀI KHOẢN', en: 'SIGN IN', ja: 'ログイン' },
    subtitle: { vi: 'Chào mừng bạn quay lại với Southcape', en: 'Welcome back to Southcape', ja: 'サウスケープへようこそ' },
    email: { vi: 'Địa chỉ Email', en: 'Email Address', ja: 'メールアドレス' },
    emailReq: { vi: 'Vui lòng nhập địa chỉ Email', en: 'Please enter your email', ja: 'メールアドレスを入力してください' },
    emailInvalid: { vi: 'Email không đúng định dạng', en: 'Invalid email address', ja: '無효なメールアドレス' },
    password: { vi: 'Mật khẩu', en: 'Password', ja: 'パスワード' },
    passwordReq: { vi: 'Vui lòng nhập mật khẩu', en: 'Please enter your password', ja: 'パスワードを入力してください' },
    forgotPass: { vi: 'Quên mật khẩu?', en: 'Forgot password?', ja: 'パスワードをお忘れですか？' },
    submitBtn: { vi: 'ĐĂNG NHẬP', en: 'SIGN IN', ja: 'ログイン' },
    noAccount: { vi: 'Chưa có tài khoản Southcape?', en: "Don't have an account?", ja: 'アカウントをお持ちでないですか？' },
    registerLink: { vi: 'Đăng ký ngay', en: 'Register now', ja: '今すぐ登録' },
    successMsg: { vi: 'Đăng nhập thành công!', en: 'Logged in successfully!', ja: 'ログインに成功しました！' },
    failedMsg: { vi: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', en: 'Login failed. Please check your credentials.', ja: 'ログインに失敗しました。認証情報をご確認ください。' },
  };

  const onFinish = async (values: { email?: string; password?: string }) => {
    try {
      const response = await loginApi({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials({
        user: response.user,
        token: response.token,
      }));

      notification.success({
        message: locale === 'vi' ? 'Đăng nhập' : 'Sign In',
        description: labels.successMsg[locale],
        placement: 'topRight'
      });

      // Chuyển hướng người dùng (nếu có quyền admin và chuyển hướng tới cms thì cho phép)
      if (response.user.role === 'admin' || response.user.role === 'superadmin') {
        navigate('/cms');
      } else {
        navigate(redirect);
      }
    } catch (err: unknown) {
      console.error('Lỗi đăng nhập:', err);
      const errorObj = err as { data?: { message?: string } };
      const errMsg = errorObj?.data?.message || labels.failedMsg[locale];
      notification.error({
        message: locale === 'vi' ? 'Đăng nhập thất bại' : 'Login Failed',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  return (
    <AnimateContainer animation="fade-in" className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gap-8 items-center">
      {/* Cột trái: Ảnh phong cách thời trang Golf tạp chí */}
      <div className="hidden lg:block relative aspect-[4/5] overflow-hidden bg-brand-border/20 border border-brand-border shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=600&auto=format&fit=crop"
          alt="Southcape Golf Editorial"
          className="w-full h-full object-cover filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
          <span className="font-serif text-xs tracking-[0.3em] font-semibold text-brand-accent uppercase mb-2">
            Southcape Signature
          </span>
          <h2 className="font-serif text-2xl font-medium tracking-wide max-w-sm leading-snug">
            {locale === 'vi' ? 'Sự tao nhã tinh tế trên từng đường bóng' : 'Refined elegance on and off the course'}
          </h2>
        </div>
      </div>

      {/* Cột phải: Form Đăng Nhập */}
      <div className="max-w-md w-full mx-auto bg-brand-light p-8 border border-brand-border shadow-sm space-y-6">
        <div className="text-center lg:text-left space-y-2">
          <span className="font-sans text-[10px] tracking-widest text-brand-gray uppercase font-bold">
            {labels.subtitle[locale]}
          </span>
          <h1 className="font-serif text-2xl font-semibold tracking-wider text-brand-dark uppercase">
            {labels.title[locale]}
          </h1>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="font-sans text-xs space-y-4"
        >
          <Form.Item
            label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.email[locale]}</span>}
            name="email"
            rules={[
              { required: true, message: labels.emailReq[locale] },
              { type: 'email', message: labels.emailInvalid[locale] }
            ]}
          >
            <Input 
              prefix={<Mail size={16} className="text-brand-gray mr-1.5" />}
              className="rounded-none h-11 border-brand-border text-xs" 
              placeholder="name@example.com" 
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="w-full flex justify-between items-center">
                <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.password[locale]}</span>
                <Link to="/forgot-password" className="text-[10px] font-semibold text-brand-gray hover:text-brand-forest uppercase tracking-wider">
                  {labels.forgotPass[locale]}
                </Link>
              </div>
            }
            name="password"
            rules={[{ required: true, message: labels.passwordReq[locale] }]}
          >
            <Input.Password 
              prefix={<Lock size={16} className="text-brand-gray mr-1.5" />}
              className="rounded-none h-11 border-brand-border text-xs" 
              placeholder="••••••••" 
            />
          </Form.Item>

          <div className="pt-2">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="w-full bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] h-12 rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
            >
              {labels.submitBtn[locale]} <ArrowRight size={14} />
            </Button>
          </div>
        </Form>

        <div className="text-center pt-4 border-t border-brand-border/60 text-xs text-brand-gray font-light">
          <span>{labels.noAccount[locale]} </span>
          <Link to="/register" className="font-semibold text-brand-forest hover:underline">
            {labels.registerLink[locale]}
          </Link>
        </div>
      </div>
    </AnimateContainer>
  );
};

export default Login;

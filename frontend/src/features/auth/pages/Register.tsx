import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRegisterMutation } from '../../store/services/rtkQueryStoreApi';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { RootState } from '../../../store';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

interface RegisterFormValues {
  fullName?: string;
  email?: string;
  password?: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerApi, { isLoading }] = useRegisterMutation();
  const { locale } = useSelector((state: RootState) => state.locale);

  const labels: Record<string, Record<string, string>> = {
    title: { vi: 'ĐĂNG KÝ THÀNH VIÊN', en: 'CREATE AN ACCOUNT', ja: '会員登録' },
    subtitle: { vi: 'Gia nhập cộng đồng Southcape tinh tế', en: 'Join the refined Southcape community', ja: '洗練されたサウスケープコミュニティに参加する' },
    fullName: { vi: 'Họ và tên', en: 'Full Name', ja: 'お名前' },
    fullNameReq: { vi: 'Vui lòng nhập họ tên của bạn', en: 'Please enter your name', ja: 'お名前を入力してください' },
    email: { vi: 'Địa chỉ Email', en: 'Email Address', ja: 'メールアドレス' },
    emailReq: { vi: 'Vui lòng nhập địa chỉ Email', en: 'Please enter your email', ja: 'メールアドレスを入力してください' },
    emailInvalid: { vi: 'Email không đúng định dạng', en: 'Invalid email address', ja: '無効なメールアドレス' },
    password: { vi: 'Mật khẩu', en: 'Password', ja: 'パスワード' },
    passwordReq: { vi: 'Vui lòng nhập mật khẩu', en: 'Please enter your password', ja: 'パスワードを入力してください' },
    passwordMin: { vi: 'Mật khẩu phải tối thiểu 6 ký tự', en: 'Password must be at least 6 characters', ja: 'パスワードは6文字以上で入力してください' },
    confirmPassword: { vi: 'Xác nhận mật khẩu', en: 'Confirm Password', ja: 'パスワードの確認' },
    confirmPasswordReq: { vi: 'Vui lòng xác nhận mật khẩu', en: 'Please confirm your password', ja: 'パスワードを再入力してください' },
    passwordMismatch: { vi: 'Hai mật khẩu không khớp', en: 'Passwords do not match', ja: 'パスワードが一致しません' },
    submitBtn: { vi: 'ĐĂNG KÝ NGAY', en: 'REGISTER NOW', ja: '今すぐ登録' },
    hasAccount: { vi: 'Đã có tài khoản Southcape?', en: 'Already have an account?', ja: 'すでにアカウントをお持ちですか？' },
    loginLink: { vi: 'Đăng nhập ngay', en: 'Sign in', ja: 'ログイン' },
    successMsg: { vi: 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', en: 'Account created successfully! Please sign in.', ja: 'アカウントが正常に作成されました！ログインしてください。' },
    failedMsg: { vi: 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.', en: 'Registration failed. Please check details.', ja: '登録に失敗しました。詳細を確認してください。' },
  };

  const onFinish = async (values: RegisterFormValues) => {
    try {
      await registerApi({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      }).unwrap();

      notification.success({
        message: locale === 'vi' ? 'Đăng ký thành công' : 'Registration Success',
        description: labels.successMsg[locale],
        placement: 'topRight'
      });
      navigate('/login');
    } catch (err: unknown) {
      console.error('Lỗi đăng ký:', err);
      const errorObj = err as { data?: { message?: string } };
      const errMsg = errorObj?.data?.message || labels.failedMsg[locale];
      notification.error({
        message: locale === 'vi' ? 'Đăng ký thất bại' : 'Registration Failed',
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
          src="https://images.unsplash.com/photo-1592819695396-064b76a5a668?q=80&w=600&auto=format&fit=crop"
          alt="Southcape Golf Editorial"
          className="w-full h-full object-cover filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
          <span className="font-serif text-xs tracking-[0.3em] font-semibold text-brand-accent uppercase mb-2">
            Southcape Clubhouse
          </span>
          <h2 className="font-serif text-2xl font-medium tracking-wide max-w-sm leading-snug">
            {locale === 'vi' ? 'Thời trang định hình phong cách sống thượng lưu' : 'Fashion that defines high-end lifestyle'}
          </h2>
        </div>
      </div>

      {/* Cột phải: Form Đăng Ký */}
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
            label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.fullName[locale]}</span>}
            name="fullName"
            rules={[{ required: true, message: labels.fullNameReq[locale] }]}
          >
            <Input 
              prefix={<User size={16} className="text-brand-gray mr-1.5" />}
              className="rounded-none h-11 border-brand-border text-xs" 
              placeholder="Nguyễn Văn A" 
            />
          </Form.Item>

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
            label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.password[locale]}</span>}
            name="password"
            rules={[
              { required: true, message: labels.passwordReq[locale] },
              { min: 6, message: labels.passwordMin[locale] }
            ]}
          >
            <Input.Password 
              prefix={<Lock size={16} className="text-brand-gray mr-1.5" />}
              className="rounded-none h-11 border-brand-border text-xs" 
              placeholder="••••••••" 
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.confirmPassword[locale]}</span>}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: labels.confirmPasswordReq[locale] },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(labels.passwordMismatch[locale]));
                },
              }),
            ]}
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
          <span>{labels.hasAccount[locale]} </span>
          <Link to="/login" className="font-semibold text-brand-forest hover:underline">
            {labels.loginLink[locale]}
          </Link>
        </div>
      </div>
    </AnimateContainer>
  );
};

export default Register;

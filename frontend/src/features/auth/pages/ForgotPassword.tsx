import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../store/services/rtkQueryStoreApi';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { RootState } from '../../../store';
import { Mail, Lock, Key, ArrowRight, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  
  const [forgotPasswordApi, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [resetPasswordApi, { isLoading: isResetLoading }] = useResetPasswordMutation();
  const { locale } = useSelector((state: RootState) => state.locale);

  // Nếu có token từ URL thì mặc định hiển thị form đặt lại mật khẩu
  const [step, setStep] = useState<1 | 2>(tokenFromUrl ? 2 : 1);
  const [emailSent, setEmailSent] = useState('');
  const [receivedToken, setReceivedToken] = useState(tokenFromUrl);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (tokenFromUrl) {
      setReceivedToken(tokenFromUrl);
      setStep(2);
    }
  }, [tokenFromUrl]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const labels: Record<string, Record<string, string>> = {
    titleForgot: { vi: 'QUÊN MẬT KHẨU', en: 'FORGOT PASSWORD', ja: 'パスワードをお忘れですか' },
    titleReset: { vi: 'ĐẶT LẠI MẬT KHẨU', en: 'RESET PASSWORD', ja: 'パスワード再設定' },
    subtitleForgot: { vi: 'Nhập email của bạn để nhận mã khôi phục', en: 'Enter your email to receive recovery token', ja: '復旧トークンを受け取るためにメールアドレスを入力してください' },
    subtitleReset: { vi: 'Nhập mã token và mật khẩu mới của bạn', en: 'Enter your token and new password', ja: 'トークンと新しいパスワードを入力してください' },
    email: { vi: 'Địa chỉ Email', en: 'Email Address', ja: 'メールアドレス' },
    emailReq: { vi: 'Vui lòng nhập địa chỉ Email', en: 'Please enter your email', ja: 'メールアドレスを入力してください' },
    emailInvalid: { vi: 'Email không đúng định dạng', en: 'Invalid email address', ja: '無効なメールアドレス' },
    token: { vi: 'Mã khôi phục (Token)', en: 'Recovery Token', ja: '復旧トークン' },
    tokenReq: { vi: 'Vui lòng nhập mã khôi phục', en: 'Please enter recovery token', ja: '復旧トークンを入力してください' },
    newPassword: { vi: 'Mật khẩu mới', en: 'New Password', ja: '新しいパスワード' },
    newPasswordReq: { vi: 'Vui lòng nhập mật khẩu mới', en: 'Please enter new password', ja: '新しいパスワードを入力してください' },
    newPasswordMin: { vi: 'Mật khẩu phải tối thiểu 6 ký tự', en: 'Password must be at least 6 characters', ja: 'パスワードは6文字以上で入力してください' },
    confirmPassword: { vi: 'Xác nhận mật khẩu mới', en: 'Confirm New Password', ja: '新しいパスワードの確認' },
    confirmPasswordReq: { vi: 'Vui lòng xác nhận mật khẩu mới', en: 'Please confirm your new password', ja: '新しいパスワードを再入力してください' },
    passwordMismatch: { vi: 'Hai mật khẩu không khớp', en: 'Passwords do not match', ja: 'パスワードが一致しません' },
    submitForgot: { vi: 'GỬI MÃ KHÔI PHỤC', en: 'SEND RECOVERY CODE', ja: 'トークンを送信' },
    submitReset: { vi: 'ĐẶT LẠI MẬT KHẨU', en: 'RESET PASSWORD', ja: 'パスワード更新' },
    backToLogin: { vi: 'Quay lại đăng nhập', en: 'Back to Sign In', ja: 'ログインに戻る' },
    goToResetStep: { vi: 'Đã có mã token? Nhập trực tiếp tại đây', en: 'Already have a token? Enter here', ja: 'すでにトークンをお持ちですか？ここで入力' },
    successForgot: { vi: 'Mã khôi phục đã được gửi! Vui lòng kiểm tra console ở Backend.', en: 'Recovery token generated! Please check backend console.', ja: '復旧トークンが生成されました！バックエンドコンソールを確認してください。' },
    successReset: { vi: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.', en: 'Password reset successfully! Please sign in.', ja: 'パスワードが正常に再設定されました！ログインしてください。' },
    failedForgot: { vi: 'Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.', en: 'Request failed. Please check your email.', ja: '送信に失敗しました。メールアドレスをご確認ください。' },
    failedReset: { vi: 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn hoặc không đúng.', en: 'Reset failed. Token might be invalid or expired.', ja: '再設定に失敗しました。トークンが無効か期限切れの可能性があります。' },
  };

  const handleForgotSubmit = async (values: { email: string }) => {
    try {
      const response = await forgotPasswordApi({ email: values.email }).unwrap();
      notification.success({
        message: locale === 'vi' ? 'Thành công' : 'Success',
        description: labels.successForgot[locale],
        placement: 'topRight'
      });
      setEmailSent(values.email);
      if (response.resetToken) {
        setReceivedToken(response.resetToken);
      }
      setStep(2);
    } catch (err: unknown) {
      console.error('Lỗi quên mật khẩu:', err);
      const errorObj = err as { data?: { message?: string } };
      const errMsg = errorObj?.data?.message || labels.failedForgot[locale];
      notification.error({
        message: locale === 'vi' ? 'Thất bại' : 'Error',
        description: errMsg,
        placement: 'topRight'
      });
    }
  };

  const handleResetSubmit = async (values: { token?: string; newPassword?: string }) => {
    try {
      await resetPasswordApi({
        token: values.token || receivedToken,
        newPassword: values.newPassword,
      }).unwrap();
      notification.success({
        message: locale === 'vi' ? 'Thành công' : 'Success',
        description: labels.successReset[locale],
        placement: 'topRight'
      });
      navigate('/login');
    } catch (err: unknown) {
      console.error('Lỗi đặt lại mật khẩu:', err);
      const errorObj = err as { data?: { message?: string } };
      const errMsg = errorObj?.data?.message || labels.failedReset[locale];
      notification.error({
        message: locale === 'vi' ? 'Thất bại' : 'Error',
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
          src="https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?q=80&w=600&auto=format&fit=crop"
          alt="Southcape Golf Editorial"
          className="w-full h-full object-cover filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
          <span className="font-serif text-xs tracking-[0.3em] font-semibold text-brand-accent uppercase mb-2">
            Southcape Heritage
          </span>
          <h2 className="font-serif text-2xl font-medium tracking-wide max-w-sm leading-snug">
            {locale === 'vi' ? 'Khôi phục kết nối và trải nghiệm dịch vụ' : 'Restore your connection and luxury experience'}
          </h2>
        </div>
      </div>

      {/* Cột phải: Form Quên mật khẩu / Đặt lại mật khẩu */}
      <div className="max-w-md w-full mx-auto bg-brand-light p-8 border border-brand-border shadow-sm space-y-6">
        {step === 1 ? (
          <>
            <div className="text-center lg:text-left space-y-2">
              <span className="font-sans text-[10px] tracking-widest text-brand-gray uppercase font-bold">
                {labels.subtitleForgot[locale]}
              </span>
              <h1 className="font-serif text-2xl font-semibold tracking-wider text-brand-dark uppercase">
                {labels.titleForgot[locale]}
              </h1>
            </div>

            <Form
              layout="vertical"
              onFinish={handleForgotSubmit}
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

              <div className="pt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isForgotLoading}
                  className="w-full bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] h-12 rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                >
                  {labels.submitForgot[locale]} <ArrowRight size={14} />
                </Button>
              </div>
            </Form>

            <div className="flex flex-col gap-2 pt-4 border-t border-brand-border/60 text-xs font-light text-center">
              <button 
                onClick={() => setStep(2)} 
                className="text-brand-forest font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                {labels.goToResetStep[locale]}
              </button>
              <Link to="/login" className="text-brand-gray hover:text-brand-dark flex items-center justify-center gap-1.5 mt-2">
                <ArrowLeft size={14} /> {labels.backToLogin[locale]}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center lg:text-left space-y-2">
              <span className="font-sans text-[10px] tracking-widest text-brand-gray uppercase font-bold">
                {labels.subtitleReset[locale]} {emailSent && `(${emailSent})`}
              </span>
              <h1 className="font-serif text-2xl font-semibold tracking-wider text-brand-dark uppercase">
                {labels.titleReset[locale]}
              </h1>
            </div>

            <Form
              layout="vertical"
              onFinish={handleResetSubmit}
              requiredMark={false}
              className="font-sans text-xs space-y-4"
              initialValues={{ token: receivedToken }}
            >
              <Form.Item
                label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.token[locale]}</span>}
                name="token"
                rules={[{ required: true, message: labels.tokenReq[locale] }]}
              >
                <Input 
                  prefix={<Key size={16} className="text-brand-gray mr-1.5" />}
                  className="rounded-none h-11 border-brand-border text-xs" 
                  placeholder="Nhập mã token từ console BE" 
                  disabled={!!tokenFromUrl}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.newPassword[locale]}</span>}
                name="newPassword"
                rules={[
                  { required: true, message: labels.newPasswordReq[locale] },
                  { min: 6, message: labels.newPasswordMin[locale] }
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
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: labels.confirmPasswordReq[locale] },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
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
                  loading={isResetLoading}
                  className="w-full bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] h-12 rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                >
                  {labels.submitReset[locale]} <ArrowRight size={14} />
                </Button>
              </div>
            </Form>

            <div className="flex flex-col gap-2 pt-4 border-t border-brand-border/60 text-xs font-light text-center">
              <button 
                onClick={() => setStep(1)} 
                className="text-brand-forest font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                {locale === 'vi' ? 'Quay lại bước yêu cầu token' : 'Back to request token step'}
              </button>
              <Link to="/login" className="text-brand-gray hover:text-brand-dark flex items-center justify-center gap-1.5 mt-2">
                <ArrowLeft size={14} /> {labels.backToLogin[locale]}
              </Link>
            </div>
          </>
        )}
      </div>
    </AnimateContainer>
  );
};

export default ForgotPassword;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { ArrowLeft, CreditCard, Landmark, Truck, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Radio, Form, Modal, Spin, notification } from 'antd';
import { RootState } from '../../../store';
import { useCreateOrderMutation } from '../../store/services/rtkQueryStoreApi';

export const Checkout: React.FC = () => {
  const { items, total, subtotal, discountAmount, isFreeShipping, resetCart } = useCart();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Lấy ngôn ngữ và tiền tệ đang chọn từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cod'>('bank');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Trạng thái modal thanh toán VNPay QR
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrTimer, setQrTimer] = useState(300); // 5 phút
  const [mockLoading, setMockLoading] = useState(false);

  // Hook tạo đơn hàng ở backend
  const [createOrderApi, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    // Nếu giỏ hàng trống và chưa hoàn tất đơn hàng, quay về trang chủ
    if (items.length === 0 && !orderCompleted) {
      navigate('/');
    }
  }, [items, orderCompleted, navigate]);

  // Bộ đếm ngược cho QR code
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (qrModalOpen && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer((prev) => prev - 1);
      }, 1000);
    } else if (qrTimer === 0) {
      setQrModalOpen(false);
      notification.error({
        message: locale === 'vi' ? 'Mã QR hết hạn' : 'QR Expired',
        description: locale === 'vi' ? 'Mã QR thanh toán đã hết hạn!' : 'Payment QR code expired!',
        placement: 'topRight'
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrModalOpen, qrTimer, locale]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const shippingCost = isFreeShipping || items.length === 0 ? 0 : (currency === 'USD' ? 15 : 375000);
  const finalTotal = total + shippingCost;

  // Xử lý khi nhấn nút Đặt Hàng và gọi API lưu vào DB
  const handlePlaceOrderSubmit = async (values: { fullName: string; phone: string; address: string; city: string; zipCode?: string }) => {
    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: {
            id: item.product.id || (item.product as { _id?: string })._id,
            sku: item.product.sku,
            name: item.product.name,
            prices: item.product.prices,
          },
          quantity: item.quantity,
        })),
        subtotal,
        discountAmount,
        shippingCost,
        total,
        currency,
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          city: values.city,
        },
        paymentMethod,
      };

      const result = await createOrderApi(orderPayload).unwrap();

      // Lấy orderCode từ kết quả API backend trả về
      setOrderId((result as { orderCode?: string }).orderCode || 'SC' + Math.floor(100000 + Math.random() * 900000));

      if (paymentMethod === 'bank') {
        // Mở modal VNPay QR giả lập
        setQrTimer(300);
        setQrModalOpen(true);
      } else {
        setOrderCompleted(true);
        resetCart();
        notification.success({
          message: locale === 'vi' ? 'Đặt hàng' : 'Order Placed',
          description: locale === 'vi' ? 'Đặt hàng thành công!' : 'Order placed successfully!',
          placement: 'topRight'
        });
      }
    } catch (err: unknown) {
      console.error('Lỗi đặt hàng:', err);
      notification.error({
        message: locale === 'vi' ? 'Đặt hàng thất bại' : 'Order Failed',
        description: locale === 'vi' ? 'Tạo đơn hàng thất bại. Vui lòng thử lại.' : 'Failed to place order. Please try again.',
        placement: 'topRight'
      });
    }
  };

  // Giả lập thanh toán QR thành công
  const handleMockPaymentSuccess = () => {
    setMockLoading(true);
    setTimeout(() => {
      setMockLoading(false);
      setQrModalOpen(false);
      setOrderCompleted(true);
      resetCart();
      notification.success({
        message: locale === 'vi' ? 'Thanh toán thành công' : 'Payment Success',
        description: locale === 'vi'
          ? 'Thanh toán VNPay QR thành công!'
          : locale === 'en'
            ? 'VNPay QR Payment Successful!'
            : 'VNPay QRの支払いが完了しました！',
        placement: 'topRight'
      });
    }, 1500);
  };

  // Nhãn đa ngôn ngữ
  const labels: Record<string, Record<string, string>> = {
    backHome: { vi: 'Quay lại trang chủ', en: 'Back to home', ja: 'ホームに戻る' },
    shippingTitle: { vi: 'THÔNG TIN GIAO HÀNG', en: 'SHIPPING DETAILS', ja: '配送先情報' },
    fullName: { vi: 'Họ và tên', en: 'Full name', ja: 'お名前' },
    fullNameReq: { vi: 'Vui lòng nhập họ tên', en: 'Please enter your name', ja: 'お名前を入力してください' },
    phone: { vi: 'Số điện thoại', en: 'Phone number', ja: '電話番号' },
    phoneReq: { vi: 'Vui lòng nhập số điện thoại', en: 'Please enter phone number', ja: '電話番号を入力してください' },
    phoneInvalid: { vi: 'Số điện thoại không hợp lệ', en: 'Invalid phone number', ja: '無効な電話番号' },
    address: { vi: 'Địa chỉ giao hàng', en: 'Shipping address', ja: '住所' },
    addressReq: { vi: 'Vui lòng nhập địa chỉ cụ thể', en: 'Please enter address', ja: '住所を入力してください' },
    city: { vi: 'Thành phố / Tỉnh', en: 'City / Province', ja: '市区町村 / 都道府県' },
    cityReq: { vi: 'Vui lòng nhập Tỉnh/Thành phố', en: 'Please enter city', ja: '市区町村を入力してください' },
    zipCode: { vi: 'Mã bưu điện (Zip)', en: 'Zip code', ja: '郵便番号' },
    paymentTitle: { vi: 'PHƯƠNG THỨC THANH TOÁN', en: 'PAYMENT METHOD', ja: 'お支払い方法' },
    cardPayment: { vi: 'Thẻ tín dụng / Thẻ ghi nợ', en: 'Credit Card / Debit Card', ja: 'クレジットカード / デビットカード' },
    cardPaymentDesc: { vi: 'Thanh toán an toàn qua cổng Visa, Mastercard, JCB', en: 'Secure payment via Visa, Mastercard, JCB', ja: 'Visa、Mastercard、JCB経由で安全に支払う' },
    qrPayment: { vi: 'Chuyển khoản QR-Pay (VNPay QR)', en: 'Bank Transfer (VNPay QR)', ja: '銀行振込 (VNPay QR)' },
    qrPaymentDesc: { vi: 'Quét mã QR để thanh toán an toàn tại chỗ', en: 'Scan QR code to pay instantly', ja: 'QRコードをスキャンして即時決済' },
    codPayment: { vi: 'Thanh toán khi nhận hàng (COD)', en: 'Cash on Delivery (COD)', ja: '代金引換 (COD)' },
    codPaymentDesc: { vi: 'Thanh toán bằng tiền mặt khi shipper giao hàng', en: 'Pay with cash upon receipt', ja: '商品受取時に現金で支払う' },
    confirmBtn: { vi: 'XÁC NHẬN ĐẶT HÀNG & THANH TOÁN', en: 'CONFIRM ORDER & PAY', ja: '注文を確認して支払う' },
    orderPreviewTitle: { vi: 'ĐƠN HÀNG CỦA BẠN', en: 'YOUR ORDER', ja: 'ご注文内容' },
    subtotal: { vi: 'Tạm tính:', en: 'Subtotal:', ja: '小計:' },
    discount: { vi: 'Giảm giá khuyến mãi:', en: 'Promo Discount:', ja: '割引額:' },
    shipping: { vi: 'Phí vận chuyển:', en: 'Shipping fee:', ja: '送料:' },
    free: { vi: 'Miễn phí', en: 'Free', ja: '無料' },
    grandTotal: { vi: 'TỔNG CỘNG:', en: 'GRAND TOTAL:', ja: '合計金額:' },
    securityNote: { vi: 'Chúng tôi bảo mật thông tin tài khoản của bạn. Bằng việc đặt hàng, bạn đồng ý với chính sách của Southcape.', en: 'We secure your personal account information. By placing an order, you agree to Southcape policies.', ja: 'アカウント情報は安全に保護されます。注文することで、Southcapeのポリシーに同意したことになります。' },

    // Thành công
    thanks: { vi: 'CẢM ƠN BẠN ĐÃ MUA SẮM', en: 'THANK YOU FOR YOUR PURCHASE', ja: 'ご購入いただきありがとうございます' },
    thanksDesc: { vi: 'Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý.', en: 'Your order has been received and is being processed.', ja: 'ご注文を承りました。現在処理中です。' },
    orderCode: { vi: 'Mã đơn hàng:', en: 'Order ID:', ja: '注文番号:' },
    orderDate: { vi: 'Thời gian đặt:', en: 'Order time:', ja: '注文日時:' },
    orderTotal: { vi: 'Tổng thanh toán:', en: 'Total Amount:', ja: '合計金額:' },
    orderStatus: { vi: 'Trạng thái:', en: 'Status:', ja: 'ステータス:' },
    awaitingConfirm: { vi: 'Chờ xác nhận', en: 'Awaiting confirmation', ja: '確認待ち' },
    goHome: { vi: 'Quay lại Trang chủ', en: 'Back to Home', ja: 'ホームに戻る' },

    // Modal QR
    qrModalTitle: { vi: 'THANH TOÁN QUA VNPAY QR', en: 'PAY WITH VNPAY QR', ja: 'VNPAY QRで支払う' },
    qrModalDesc: { vi: 'Quét mã QR bên dưới bằng ứng dụng Ngân hàng hoặc Ví điện tử để hoàn tất thanh toán.', en: 'Scan the QR code below using your Banking App or E-Wallet to complete payment.', ja: '銀行アプリまたは電子マネーを使用して以下のQRコードをスキャンし、支払いを完了させてください。' },
    amountToPay: { vi: 'Số tiền cần thanh toán', en: 'Amount to pay', ja: '支払金額' },
    qrExpiry: { vi: 'Mã QR hết hạn sau:', en: 'QR code expires in:', ja: '有効期限:' },
    waitingPayment: { vi: 'Đang chờ thanh toán...', en: 'Awaiting payment confirmation...', ja: '支払い確認を待っています...' },
    simulateBtn: { vi: 'Giả lập thanh toán thành công (Sandbox)', en: 'Simulate Payment Success (Sandbox)', ja: '支払成功をシミュレートする' },
    cancelBtn: { vi: 'Hủy giao dịch', en: 'Cancel Transaction', ja: '取引をキャンセル' },
  };

  if (orderCompleted) {
    return (
      <AnimateContainer animation="fade-in" className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-brand-light p-8 border border-brand-border text-center space-y-6 shadow-md animate-slide-up">
          <CheckCircle2 size={56} className="text-brand-forest mx-auto animate-bounce" />
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-semibold text-brand-dark">{labels.thanks[locale]}</h2>
            <p className="text-xs text-brand-gray font-sans font-light">
              {labels.thanksDesc[locale]}
            </p>
          </div>

          <div className="bg-brand-border/20 p-4 border border-brand-border text-xs font-sans space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-brand-gray">{labels.orderCode[locale]}</span>
              <strong className="text-brand-dark">{orderId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">{labels.orderDate[locale]}</span>
              <span className="text-brand-dark">{dayjs().format(locale === 'vi' ? 'DD/MM/YYYY HH:mm:ss' : 'MM/DD/YYYY hh:mm:ss A')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">{labels.orderTotal[locale]}</span>
              <strong className="text-brand-forest">{formatPrice(finalTotal, currency)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">{labels.orderStatus[locale]}</span>
              <span className="text-brand-forest font-semibold">{labels.awaitingConfirm[locale]}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-brand-forest border-brand-forest text-white hover:bg-[#22442d] hover:border-[#22442d] h-11 rounded-none font-sans text-xs tracking-wider uppercase font-bold transition-all cursor-pointer"
            >
              {labels.goHome[locale]}
            </Button>
          </div>
        </div>
      </AnimateContainer>
    );
  }

  return (
    <AnimateContainer animation="fade-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Quay lại */}
      <Link
        to="/"
        className="flex items-center gap-1 text-[11px] font-sans font-semibold tracking-wider text-brand-gray uppercase hover:text-brand-dark transition-colors w-fit"
      >
        <ArrowLeft size={14} /> {labels.backHome[locale]}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">

        {/* Cột Trái: Điền thông tin giao hàng & thanh toán (Chiếm 3/5 cột) */}
        <div className="lg:col-span-3 space-y-6 bg-brand-light p-6 md:p-8 border border-brand-border shadow-sm">
          <h2 className="font-serif text-xl font-semibold tracking-widest text-brand-dark uppercase border-b border-brand-border pb-4">
            {labels.shippingTitle[locale]}
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlaceOrderSubmit}
            className="font-sans text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.fullName[locale]}</span>}
                name="fullName"
                rules={[{ required: true, message: labels.fullNameReq[locale] }]}
              >
                <Input className="rounded-none h-10 border-brand-border text-xs" placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.phone[locale]}</span>}
                name="phone"
                rules={[
                  { required: true, message: labels.phoneReq[locale] },
                  { pattern: /^[0-9+]{9,11}$/, message: labels.phoneInvalid[locale] }
                ]}
              >
                <Input className="rounded-none h-10 border-brand-border text-xs" placeholder="0987654321" />
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.address[locale]}</span>}
              name="address"
              rules={[{ required: true, message: labels.addressReq[locale] }]}
            >
              <Input className="rounded-none h-10 border-brand-border text-xs" placeholder="Số nhà, Tên đường, Phường/Xã..." />
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.city[locale]}</span>}
                name="city"
                rules={[{ required: true, message: labels.cityReq[locale] }]}
              >
                <Input className="rounded-none h-10 border-brand-border text-xs" placeholder="Hà Nội" />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs font-semibold text-brand-dark uppercase tracking-wider">{labels.zipCode[locale]}</span>}
                name="zipCode"
              >
                <Input className="rounded-none h-10 border-brand-border text-xs" placeholder="100000" />
              </Form.Item>
            </div>

            {/* Chọn phương thức thanh toán */}
            <div className="pt-6 border-t border-brand-border mt-6 space-y-4">
              <h3 className="font-serif text-sm font-semibold tracking-widest text-brand-dark uppercase">
                {labels.paymentTitle[locale]}
              </h3>

              <div className="space-y-3">
                {/* Chuyển khoản QR-Pay (VNPay) */}
                <div
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === 'bank' ? 'border-brand-forest bg-brand-forest/5' : 'border-brand-border hover:border-brand-gray'
                    }`}
                >
                  <Radio checked={paymentMethod === 'bank'} className="accent-brand-forest mt-0.5" />
                  <Landmark size={18} className="text-brand-forest mt-0.5" />
                  <div className="text-xs font-sans">
                    <strong className="text-brand-dark block">{labels.qrPayment[locale]}</strong>
                    <span className="text-brand-gray font-light text-[11px]">{labels.qrPaymentDesc[locale]}</span>
                  </div>
                </div>

                {/* Thẻ tín dụng */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brand-forest bg-brand-forest/5' : 'border-brand-border hover:border-brand-gray'
                    }`}
                >
                  <Radio checked={paymentMethod === 'card'} className="accent-brand-forest mt-0.5" />
                  <CreditCard size={18} className="text-brand-forest mt-0.5" />
                  <div className="text-xs font-sans">
                    <strong className="text-brand-dark block">{labels.cardPayment[locale]}</strong>
                    <span className="text-brand-gray font-light text-[11px]">{labels.cardPaymentDesc[locale]}</span>
                  </div>
                </div>

                {/* COD */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-forest bg-brand-forest/5' : 'border-brand-border hover:border-brand-gray'
                    }`}
                >
                  <Radio checked={paymentMethod === 'cod'} className="accent-brand-forest mt-0.5" />
                  <Truck size={18} className="text-brand-forest mt-0.5" />
                  <div className="text-xs font-sans">
                    <strong className="text-brand-dark block">{labels.codPayment[locale]}</strong>
                    <span className="text-brand-gray font-light text-[11px]">{labels.codPaymentDesc[locale]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Đặt hàng */}
            <div className="pt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreatingOrder}
                className="w-full bg-brand-forest border-brand-forest hover:bg-[#22442d] hover:border-[#22442d] h-12 rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                {labels.confirmBtn[locale]}
              </Button>
            </div>
          </Form>
        </div>

        {/* Cột Phải: Tóm tắt đơn hàng (Chiếm 2/5 cột) */}
        <div className="lg:col-span-2 space-y-6 bg-brand-light p-6 border border-brand-border shadow-sm sticky top-28">
          <h3 className="font-serif text-sm font-semibold tracking-widest text-brand-dark uppercase border-b border-brand-border pb-4">
            {labels.orderPreviewTitle[locale]}
          </h3>

          {/* Danh sách sản phẩm */}
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar border-b border-brand-border/60 pb-4">
            {items.map((item) => {
              const productPrice = item.product?.prices?.[currency]?.price || 0;
              const itemTitle = item.product?.name?.[locale] || item.product?.name?.['vi'] || '';
              return (
                <div key={item.id} className="flex gap-3 justify-between items-center text-xs">
                  <div className="flex gap-3 items-center min-w-0">
                    <img
                      src={item.product?.images?.[0] || ''}
                      alt={itemTitle}
                      className="w-12 h-16 object-cover border border-brand-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-sans font-semibold text-brand-dark truncate pr-2">
                        {itemTitle}
                      </h4>
                      <p className="text-[10px] text-brand-gray font-light">
                        Màu: {item.selectedColor} / Cỡ: {item.selectedSize} / SL: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-sans font-medium text-brand-dark">
                    {formatPrice(productPrice * item.quantity, currency)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Giá tiền */}
          <div className="space-y-2 text-xs font-sans">
            <div className="flex justify-between text-brand-gray">
              <span>{labels.subtotal[locale]}</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-500 font-medium">
                <span>{labels.discount[locale]}</span>
                <span>-{formatPrice(discountAmount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-gray">
              <span>{labels.shipping[locale]}</span>
              <span>{shippingCost === 0 ? labels.free[locale] : formatPrice(shippingCost, currency)}</span>
            </div>
            <div className="flex justify-between text-brand-dark font-bold text-sm pt-3 border-t border-brand-border">
              <span>{labels.grandTotal[locale]}</span>
              <span className="text-base text-brand-forest">{formatPrice(finalTotal, currency)}</span>
            </div>
          </div>

          <div className="bg-brand-border/20 p-3 rounded-none text-[10px] text-brand-gray flex items-start gap-2 leading-relaxed">
            <ShieldCheck size={16} className="text-brand-forest flex-shrink-0 mt-0.5" />
            <span>{labels.securityNote[locale]}</span>
          </div>
        </div>
      </div>

      {/* MODAL GIẢ LẬP THANH TOÁN VNPAY QR */}
      <Modal
        title={
          <div className="flex items-center gap-2 border-b border-brand-border/40 pb-2">
            <QrCode className="text-[#005ba1]" size={20} />
            <span className="font-serif text-base tracking-wider font-semibold text-[#005ba1]">
              {labels.qrModalTitle[locale]}
            </span>
          </div>
        }
        open={qrModalOpen}
        onCancel={() => setQrModalOpen(false)}
        footer={null}
        width={420}
        destroyOnClose
        className="rounded-none font-sans"
        closable={!mockLoading}
        maskClosable={false}
      >
        <Spin spinning={mockLoading} tip={labels.waitingPayment[locale]}>
          <div className="flex flex-col items-center text-center space-y-4 pt-4">
            <p className="text-xs text-brand-gray leading-relaxed px-4">
              {labels.qrModalDesc[locale]}
            </p>

            <div className="bg-brand-border/20 p-2 border border-brand-border/40 w-max font-sans text-xs">
              <span className="text-brand-gray text-[10px] block uppercase tracking-wider">{labels.amountToPay[locale]}</span>
              <strong className="text-lg text-brand-forest">{formatPrice(finalTotal, currency)}</strong>
            </div>

            {/* Khung chứa mã QR giả lập */}
            <div className="relative p-4 border border-brand-border bg-white shadow-inner flex flex-col items-center justify-center">
              {/* Vẽ QR giả lập bằng SVG cho chuyên nghiệp */}
              <svg width="180" height="180" viewBox="0 0 100 100" className="text-brand-dark">
                <rect width="100" height="100" fill="white" />
                {/* 4 Corners */}
                <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                <rect x="8" y="8" width="19" height="19" fill="white" />
                <rect x="12" y="12" width="11" height="11" fill="currentColor" />

                <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                <rect x="73" y="8" width="19" height="19" fill="white" />
                <rect x="77" y="12" width="11" height="11" fill="currentColor" />

                <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                <rect x="8" y="73" width="19" height="19" fill="white" />
                <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                {/* Random QR code pixels block */}
                <rect x="40" y="10" width="10" height="5" fill="currentColor" />
                <rect x="55" y="5" width="5" height="15" fill="currentColor" />
                <rect x="45" y="25" width="15" height="10" fill="currentColor" />
                <rect x="5" y="40" width="15" height="5" fill="currentColor" />
                <rect x="25" y="45" width="10" height="15" fill="currentColor" />
                <rect x="45" y="45" width="15" height="5" fill="currentColor" />
                <rect x="70" y="40" width="25" height="5" fill="currentColor" />
                <rect x="85" y="50" width="10" height="15" fill="currentColor" />
                <rect x="5" y="60" width="10" height="5" fill="currentColor" />
                <rect x="40" y="65" width="20" height="10" fill="currentColor" />
                <rect x="70" y="70" width="15" height="5" fill="currentColor" />
                <rect x="80" y="85" width="15" height="10" fill="currentColor" />
                <rect x="45" y="85" width="10" height="10" fill="currentColor" />

                {/* Central Brand Logo placeholder */}
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <circle cx="50" cy="50" r="6" fill="#183020" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/60 text-white font-sans text-[11px] font-bold p-4 text-center cursor-pointer" onClick={handleMockPaymentSuccess}>
                {labels.simulateBtn[locale]}
              </div>
            </div>

            <div className="text-xs font-semibold text-brand-dark flex items-center gap-1.5">
              <span>{labels.qrExpiry[locale]}</span>
              <span className="text-red-500 font-mono text-sm font-bold">{formatTimer(qrTimer)}</span>
            </div>

            <div className="w-full flex flex-col gap-2 pt-2 border-t border-brand-border/40">
              <Button
                type="primary"
                onClick={handleMockPaymentSuccess}
                className="w-full bg-[#005ba1] border-[#005ba1] text-white hover:bg-[#004780] hover:border-[#004780] h-10 rounded-none text-xs font-bold uppercase cursor-pointer"
              >
                {labels.simulateBtn[locale]}
              </Button>
              <Button
                onClick={() => setQrModalOpen(false)}
                className="w-full h-10 rounded-none text-xs font-sans hover:text-red-500 hover:border-red-500 cursor-pointer"
              >
                {labels.cancelBtn[locale]}
              </Button>
            </div>
          </div>
        </Spin>
      </Modal>
    </AnimateContainer>
  );
};

export default Checkout;

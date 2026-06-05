import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils';
import { AnimateContainer } from '../../../components/AnimateContainer';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Progress, notification } from 'antd';
import { RootState } from '../../../store';
import { useValidateCouponMutation } from '../../store/services/rtkQueryStoreApi';

export const CartPage: React.FC = () => {
  const {
    items,
    promoCode,
    discountPercentage,
    itemsCount,
    subtotal,
    discountAmount,
    total,
    isFreeShipping,
    neededForFreeShipping,
    freeShippingProgress,
    freeShippingThreshold,
    removeProduct,
    changeQuantity,
    setPromo,
    removeCode,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  // Lấy locale và currency từ Redux
  const { locale, currency } = useSelector((state: RootState) => state.locale);
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

  // Nhãn đa ngôn ngữ tĩnh
  const labels: Record<string, Record<string, string>> = {
    backToShop: { vi: 'Tiếp tục mua sắm', en: 'Continue Shopping', ja: '買い物を続ける' },
    cartTitle: { vi: 'GIỎ HÀNG CỦA BẠN', en: 'YOUR SHOPPING BAG', ja: 'ショッピングバッグ' },
    cartCount: { vi: 'Có tất cả {count} sản phẩm trong túi hàng.', en: 'There are {count} items in your bag.', ja: 'バッグの中に {count} 個のアイテムがあります。' },
    emptyTitle: { vi: 'Túi hàng của bạn đang trống', en: 'Your bag is empty', ja: 'バッグは空です' },
    emptyDesc: { vi: 'Bạn chưa chọn được món đồ nào. Hãy khám phá ngay các concept thời trang golf sang trọng của Southcape nhé!', en: 'You have not added any items yet. Explore the luxurious golf fashion concepts of Southcape now!', ja: 'アイテムがまだ追加されていません。サウスケープのラグジュアリーなゴルフファッションコンセプトをご覧ください。' },
    exploreConcepts: { vi: 'Khám phá các Concept', en: 'Explore Concepts', ja: 'コンセプトを見る' },
    productCol: { vi: 'Sản phẩm', en: 'Product', ja: '商品' },
    priceCol: { vi: 'Đơn giá', en: 'Price', ja: '単価' },
    qtyCol: { vi: 'Số lượng', en: 'Quantity', ja: '数量' },
    totalCol: { vi: 'Tổng tiền', en: 'Total', ja: '小計' },
    colorLabel: { vi: 'Màu sắc', en: 'Color', ja: 'カラー' },
    sizeLabel: { vi: 'Kích cỡ', en: 'Size', ja: 'サイズ' },
    removeAlert: { vi: 'Đã xóa sản phẩm khỏi giỏ hàng', en: 'Item removed from cart', ja: '商品をカートから削除しました' },
    summaryTitle: { vi: 'TÓM TẮT ĐƠN HÀNG', en: 'ORDER SUMMARY', ja: '注文内容の概要' },
    freeShipAlert: { vi: 'Chúc mừng! Bạn được miễn phí vận chuyển', en: 'Congratulations! You get free shipping', ja: 'おめでとうございます！送料無料です' },
    buyMore: { vi: 'Mua thêm {amount} để được miễn phí vận chuyển', en: 'Add {amount} more for free shipping', ja: 'あと {amount} の追加で送料無料になります' },
    shipMilestone: { vi: 'Mốc {limit}', en: 'Limit {limit}', ja: '目標 {limit}' },
    couponApplied: { vi: 'Mã áp dụng: {code} (-{percent}%)', en: 'Code applied: {code} (-{percent}%)', ja: '適用コード: {code} (-{percent}%)' },
    couponInvalid: { vi: 'Mã giảm giá không hợp lệ. Thử lại với SOUTHCAPE10 hoặc GOLF20', en: 'Invalid coupon code. Try SOUTHCAPE10 or GOLF20', ja: '無効なクーポンコードです。SOUTHCAPE10またはGOLF20をお試しください' },
    couponSuccess: { vi: 'Đã áp dụng mã giảm giá thành công!', en: 'Coupon code applied successfully!', ja: 'クーポンコードが適用されました！' },
    couponPlaceholder: { vi: 'Mã: SOUTHCAPE10 / GOLF20', en: 'Code: SOUTHCAPE10 / GOLF20', ja: 'コード: SOUTHCAPE10 / GOLF20' },
    applyBtn: { vi: 'Áp dụng', en: 'Apply', ja: '適用' },
    removeBtn: { vi: 'Xóa', en: 'Remove', ja: '削除' },
    subtotalLabel: { vi: 'Tạm tính:', en: 'Subtotal:', ja: '小計:' },
    discountLabel: { vi: 'Khấu trừ ưu đãi:', en: 'Discount:', ja: '割引:' },
    shippingLabel: { vi: 'Phí vận chuyển:', en: 'Shipping fee:', ja: '送料:' },
    freeShipping: { vi: 'Miễn phí', en: 'Free', ja: '無料' },
    grandTotalLabel: { vi: 'TỔNG THÀNH TOÁN:', en: 'GRAND TOTAL:', ja: '合計金額:' },
    checkoutBtn: { vi: 'TIẾN HÀNH THANH TOÁN', en: 'PROCEED TO CHECKOUT', ja: 'レジに進む' },
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    
    try {
      // Gọi API kiểm tra mã giảm giá với số tiền tạm tính
      const result = await validateCoupon({ code, amount: subtotal }).unwrap();
      
      let discountPercent = 0;
      if (result.discountType === 'percent') {
        discountPercent = result.discountValue;
      } else if (result.discountType === 'fixed') {
        // Tỷ lệ phần trăm quy đổi tương đương
        discountPercent = subtotal > 0 ? Math.round((result.discountValue / subtotal) * 100) : 0;
      }
      
      setPromo(result.code, discountPercent);
      
      notification.success({
        message: locale === 'vi' ? 'Áp dụng thành công' : 'Coupon Applied',
        description: locale === 'vi' 
          ? `Đã áp dụng mã giảm giá ${result.code} thành công!`
          : `Successfully applied coupon code ${result.code}!`,
        placement: 'topRight'
      });
    } catch (err: any) {
      console.error('Lỗi áp dụng mã giảm giá:', err);
      const errMsg = err?.data?.message || labels.couponInvalid[locale];
      notification.error({
        message: locale === 'vi' ? 'Áp dụng thất bại' : 'Coupon Failed',
        description: errMsg,
        placement: 'topRight'
      });
    }
    setCouponInput('');
  };

  // Tính phí vận chuyển theo loại tiền tệ (USD: $15, VND: 375,000₫)
  const shippingCost = isFreeShipping || items.length === 0 ? 0 : (currency === 'USD' ? 15 : 375000);
  const finalTotal = total + shippingCost;

  return (
    <AnimateContainer animation="fade-in" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh] space-y-8">
      {/* Nút quay lại mua sắm */}
      <Link
        to="/"
        className="flex items-center gap-1.5 text-[11px] font-sans font-semibold tracking-wider text-brand-gray uppercase hover:text-brand-dark transition-colors w-fit"
      >
        <ArrowLeft size={14} /> {labels.backToShop[locale]}
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-brand-dark uppercase">
          {labels.cartTitle[locale]}
        </h1>
        <p className="text-xs text-brand-gray font-sans font-light">
          {labels.cartCount[locale].replace('{count}', itemsCount.toString())}
        </p>
      </div>

      {items.length === 0 ? (
        // Trạng thái giỏ hàng trống
        <div className="py-20 border border-brand-border flex flex-col items-center justify-center text-center gap-6 bg-brand-light shadow-sm">
          <div className="w-20 h-20 rounded-full bg-brand-border/30 flex items-center justify-center text-brand-gray">
            <ShoppingBag size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-medium text-brand-dark">{labels.emptyTitle[locale]}</h3>
            <p className="text-xs text-brand-gray max-w-[320px] leading-relaxed">
              {labels.emptyDesc[locale]}
            </p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="border-brand-forest text-brand-forest hover:bg-brand-forest hover:text-white px-8 h-12 rounded-none tracking-widest font-sans text-xs uppercase font-bold transition-all duration-300 cursor-pointer"
          >
            {labels.exploreConcepts[locale]}
          </Button>
        </div>
      ) : (
        // Trạng thái giỏ hàng có sản phẩm (Grid 2 cột)
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          
          {/* Cột Trái: Danh sách sản phẩm lớn (Chiếm 3/5 cột) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-brand-light border border-brand-border shadow-sm p-6 space-y-6">
              
              {/* Header của bảng trên màn hình lớn */}
              <div className="hidden sm:grid grid-cols-12 text-[10px] font-sans font-bold tracking-widest text-brand-gray uppercase border-b border-brand-border pb-3">
                <div className="col-span-6">{labels.productCol[locale]}</div>
                <div className="col-span-2 text-center">{labels.priceCol[locale]}</div>
                <div className="col-span-2 text-center">{labels.qtyCol[locale]}</div>
                <div className="col-span-2 text-right">{labels.totalCol[locale]}</div>
              </div>

              {/* Từng sản phẩm */}
              <div className="space-y-6">
                {items.map((item) => {
                  const productItemPrice = item.product?.prices?.[currency]?.price || 0;
                  const itemTitle = item.product?.name?.[locale] || item.product?.name?.['vi'] || '';
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 pb-6 border-b border-brand-border last:border-b-0 last:pb-0"
                    >
                      {/* Ảnh & thông tin chi tiết */}
                      <div className="col-span-1 sm:col-span-6 flex gap-4 min-w-0">
                        <div
                          onClick={() => navigate(`/product/${item.product?.id || ''}`)}
                          className="w-20 h-26 bg-brand-border/10 overflow-hidden flex-shrink-0 cursor-pointer"
                        >
                          <img
                            src={item.product?.images?.[0] || ''}
                            alt={itemTitle}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0 flex flex-col justify-between py-1">
                          <div>
                            <h4
                              onClick={() => navigate(`/product/${item.product?.id || ''}`)}
                              className="font-sans text-sm font-semibold text-brand-dark truncate cursor-pointer hover:text-brand-forest transition-colors"
                            >
                              {itemTitle}
                            </h4>
                            <span className="text-[10px] text-brand-gray tracking-wider uppercase font-light mt-0.5 block">
                              {item.product?.subCategory || ''}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-brand-gray font-light">
                              {labels.colorLabel[locale]}: <strong>{item.selectedColor}</strong>
                            </p>
                            <p className="text-xs text-brand-gray font-light">
                              {labels.sizeLabel[locale]}: <strong className="text-brand-dark bg-brand-border/30 px-1.5 py-0.5">{item.selectedSize}</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Đơn giá */}
                      <div className="col-span-1 sm:col-span-2 text-left sm:text-center font-sans text-xs">
                        <span className="sm:hidden text-brand-gray mr-1">{labels.priceCol[locale]}:</span>
                        <span className="font-semibold text-brand-dark">{formatPrice(productItemPrice, currency)}</span>
                      </div>

                      {/* Bộ điều chỉnh số lượng */}
                      <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center items-center">
                        <div className="flex items-center border border-brand-border h-8 bg-white">
                          <button
                            onClick={() => changeQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2.5 text-brand-gray hover:text-brand-dark disabled:opacity-30 transition-colors h-full cursor-pointer"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="px-3 text-xs font-sans font-semibold text-brand-dark select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => changeQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 text-brand-gray hover:text-brand-dark transition-colors h-full cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Tổng tiền món */}
                      <div className="col-span-1 sm:col-span-2 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end font-sans text-sm">
                        <span className="sm:hidden text-brand-gray text-xs">{labels.totalCol[locale]}:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-brand-forest">
                            {formatPrice(productItemPrice * item.quantity, currency)}
                          </span>
                          <button
                            onClick={() => {
                              removeProduct(item.id);
                              notification.info({
                                message: locale === 'vi' ? 'Cập nhật giỏ hàng' : 'Cart Updated',
                                description: labels.removeAlert[locale],
                                placement: 'topRight'
                              });
                            }}
                            className="text-brand-gray hover:text-red-500 transition-colors cursor-pointer"
                            title="Xóa món này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cột Phải: Hóa đơn thanh toán (Chiếm 2/5 cột) */}
          <div className="lg:col-span-2 space-y-6 sticky top-28">
            <div className="bg-brand-light border border-brand-border shadow-sm p-6 space-y-6">
              <h3 className="font-serif text-sm font-semibold tracking-widest text-brand-dark uppercase border-b border-brand-border pb-4">
                {labels.summaryTitle[locale]}
              </h3>

              {/* Miễn phí vận chuyển */}
              <div className="space-y-2 text-xs font-sans">
                <div className="flex justify-between tracking-wide">
                  <span className="text-brand-dark">
                    {isFreeShipping ? (
                      <strong className="text-brand-forest">{labels.freeShipAlert[locale]}</strong>
                    ) : (
                      <span>
                        {labels.buyMore[locale].replace(
                          '{amount}',
                          formatPrice(neededForFreeShipping, currency)
                        )}
                      </span>
                    )}
                  </span>
                  <span className="text-brand-gray font-semibold">
                    {labels.shipMilestone[locale].replace(
                      '{limit}',
                      formatPrice(freeShippingThreshold, currency)
                    )}
                  </span>
                </div>
                <Progress
                  percent={freeShippingProgress}
                  showInfo={false}
                  strokeColor="#183020"
                  trailColor="#e8e6e1"
                  strokeWidth={5}
                  className="m-0"
                />
              </div>

              {/* Mã giảm giá */}
              <div className="pt-2">
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 text-xs text-brand-forest">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="fill-brand-forest/10 animate-pulse" />
                      <span>
                        {labels.couponApplied[locale]
                          .replace('{code}', promoCode)
                          .replace('{percent}', discountPercentage.toString())}
                      </span>
                    </div>
                    <button
                      onClick={removeCode}
                      className="text-red-500 font-semibold hover:underline cursor-pointer"
                    >
                      {labels.removeBtn[locale]}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder={labels.couponPlaceholder[locale]}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onPressEnter={handleApplyCoupon}
                      disabled={isValidatingCoupon}
                      className="rounded-none border-brand-border text-xs focus:border-brand-forest hover:border-brand-forest focus:shadow-none h-10"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      loading={isValidatingCoupon}
                      className="rounded-none border-brand-dark bg-brand-dark text-white hover:bg-brand-forest hover:border-brand-forest text-xs font-sans h-10 px-4 tracking-wider uppercase transition-all duration-300 cursor-pointer"
                    >
                      {labels.applyBtn[locale]}
                    </Button>
                  </div>
                )}
              </div>

              {/* Bảng giá hạch toán */}
              <div className="space-y-2 pt-2 text-xs font-sans border-t border-brand-border/60">
                <div className="flex justify-between text-brand-gray">
                  <span>{labels.subtotalLabel[locale]}</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-500 font-semibold">
                    <span>{labels.discountLabel[locale]}</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-gray">
                  <span>{labels.shippingLabel[locale]}</span>
                  <span>{shippingCost === 0 ? labels.freeShipping[locale] : formatPrice(shippingCost, currency)}</span>
                </div>
                <div className="flex justify-between text-brand-dark font-bold text-sm pt-4 border-t border-brand-border">
                  <span>{labels.grandTotalLabel[locale]}</span>
                  <span className="text-base text-brand-forest">{formatPrice(finalTotal, currency)}</span>
                </div>
              </div>

              {/* Nút đặt hàng */}
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-brand-forest border-brand-forest text-white hover:bg-[#22442d] hover:border-[#22442d] h-12 rounded-none font-sans text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              >
                {labels.checkoutBtn[locale]} <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </AnimateContainer>
  );
};

export default CartPage;

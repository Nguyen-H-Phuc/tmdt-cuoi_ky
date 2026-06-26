import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

// Import sub-components
import CheckoutReceiverForm from '../components/CheckoutReceiverForm.jsx';
import CheckoutShippingForm from '../components/CheckoutShippingForm.jsx';
import CheckoutPaymentMethod from '../components/CheckoutPaymentMethod.jsx';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary.jsx';
import CheckoutSuccessReceipt from '../components/CheckoutSuccessReceipt.jsx';


const CheckoutPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { removeFromCart } = useCart();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Checkout Form States
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('campus'); // 'campus' or 'home'
  const [dormInfo, setDormInfo] = useState('');
  const [specificAddress, setSpecificAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vnpay'); // 'vnpay' or 'cod'
  const [appliedVoucher, setAppliedVoucher] = useState(true); // Default voucher for students: -10k

  // Process States
  const [step, setStep] = useState(1); // 1: Form, 2: Result
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [vnpayTab, setVnpayTab] = useState('qr'); // 'qr', 'atm', 'wallet'
  const [selectedBank, setSelectedBank] = useState('');
  const [vnpayProcessing, setVnpayProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // 'success' or 'fail'
  const [orderId, setOrderId] = useState('');

  // Form errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const status = query.get('status');
    const code = query.get('orderCode');

    if (status && code) {
      if (status === 'success') {
        const fetchOrderDetails = async () => {
          try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8080/api/orders/code/${code}`);
            const orderData = res.data;
            
            if (orderData.details && orderData.details.length > 0) {
              setCheckoutItems(orderData.details.map(d => ({
                ...d.product,
                quantity: d.quantity
              })));
            } else if (orderData.product) {
              setCheckoutItems([{
                ...orderData.product,
                quantity: 1
              }]);
            }
            
            setFullName(orderData.receiverName);
            setPhone(orderData.receiverPhone);
            setDeliveryMethod(orderData.deliveryMethod);
            setUniversity(orderData.university || '');
            setDormInfo(orderData.dormInfo || '');
            setSpecificAddress(orderData.specificAddress || '');
            setNotes(orderData.notes || '');
            setPaymentMethod(orderData.paymentMethod);
            setOrderId(code);
            setStep(2);
            
            // Sync cart: Remove purchased products from cart
            if (orderData.details && orderData.details.length > 0) {
              for (const detail of orderData.details) {
                removeFromCart(detail.product.productId);
              }
            } else if (orderData.product) {
              removeFromCart(orderData.product.productId);
            }
            
            setLoading(false);
          } catch (err) {
            console.error("Error fetching order details", err);
            setLoading(false);
          }
        };
        fetchOrderDetails();
      } else {
        alert("Thanh toán qua cổng VNPay thất bại hoặc đã bị hủy.");
        if (productId === 'cart') {
          const items = JSON.parse(localStorage.getItem('checkout_items')) || [];
          setCheckoutItems(items);
          setLoading(false);
        } else {
          const fetchProduct = async () => {
            try {
              const res = await axios.get(`http://localhost:8080/api/products/${productId}`);
              setCheckoutItems([{
                ...res.data,
                quantity: 1
              }]);
              setLoading(false);
            } catch (err) {
              console.error("Error fetching product for checkout", err);
              setLoading(false);
            }
          };
          fetchProduct();
        }
      }
    } else {
      // Normal checkout page load
      if (productId === 'cart') {
        const items = JSON.parse(localStorage.getItem('checkout_items')) || [];
        setCheckoutItems(items);
        setLoading(false);
      } else {
        const fetchProduct = async () => {
          try {
            const res = await axios.get(`http://localhost:8080/api/products/${productId}`);
            setCheckoutItems([{
              ...res.data,
              quantity: 1
            }]);
            setLoading(false);
          } catch (err) {
            console.error("Error fetching product for checkout", err);
            setLoading(false);
          }
        };
        fetchProduct();
      }
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (vnpayProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            {paymentMethod === 'vnpay' ? 'Đang chuyển hướng đến cổng thanh toán VNPay...' : 'Đang xử lý đặt hàng...'}
          </p>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không có sản phẩm để thanh toán</h2>
          <p className="text-gray-500 mb-6">Giỏ hàng thanh toán của bạn trống hoặc không hợp lệ. Vui lòng quay lại giỏ hàng.</p>
          <Link to="/cart" className="inline-block px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-neutral-900 font-bold rounded-xl transition">
            Về giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  const itemsSubtotal = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingFee = deliveryMethod === 'home' ? 20000 : 0;
  const voucherDiscount = appliedVoucher ? 10000 : 0;
  const totalAmount = Math.max(0, itemsSubtotal + shippingFee - voucherDiscount);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone)) {
      newErrors.phone = 'Số điện thoại không đúng định dạng';
    }

    if (deliveryMethod === 'campus') {
      if (!university.trim()) newErrors.university = 'Vui lòng nhập tên trường';
      if (!dormInfo.trim()) newErrors.dormInfo = 'Vui lòng nhập khu vực/phòng ký túc xá';
    } else {
      if (!specificAddress.trim()) newErrors.specificAddress = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setVnpayProcessing(true);
    try {
      const orderPayload = {
        productId: checkoutItems[0]?.productId,
        items: checkoutItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity || 1
        })),
        buyerId: currentUser?.userId,
        fullName: fullName,
        phone: phone,
        deliveryMethod: deliveryMethod,
        university: university,
        dormInfo: dormInfo,
        specificAddress: specificAddress,
        notes: notes,
        paymentMethod: paymentMethod
      };

      const res = await axios.post('http://localhost:8080/api/orders', orderPayload);
      
      // Clear purchased items from cart on client side immediately
      for (const item of checkoutItems) {
        try {
          await removeFromCart(item.productId);
        } catch (err) {
          console.error("Lỗi đồng bộ xóa giỏ hàng:", err);
        }
      }
      
      if (paymentMethod === 'vnpay') {
        if (res.data.paymentUrl) {
          // Redirect to VNPay Gateway
          window.location.href = res.data.paymentUrl;
        } else {
          throw new Error("Không nhận được URL thanh toán từ hệ thống.");
        }
      } else {
        // COD order
        setOrderId(res.data.orderCode);
        setStep(2);
        setVnpayProcessing(false);
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert(err.response?.data?.message || err.message || "Đặt hàng thất bại. Vui lòng thử lại!");
      setVnpayProcessing(false);
    }
  };

  const coverImage = checkoutItems[0]?.images?.length > 0 
    ? checkoutItems[0].images[0] 
    : (checkoutItems[0]?.imageUrl || '/house_1.png');

  return (
    <div className="bg-[#F4F4F4] min-h-screen py-6">
      <div className="max-w-[1000px] mx-auto px-4">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-sm"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-500">Trở lại chi tiết</span>
        </div>

        {/* Stepper bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-neutral-100 flex justify-between items-center px-8 md:px-16">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-brand-primary text-neutral-900' : 'bg-green-100 text-green-700'}`}>
              {step > 1 ? <CheckCircle2 size={16} /> : '1'}
            </div>
            <span className={`text-xs md:text-sm font-bold ${step === 1 ? 'text-gray-800' : 'text-green-600'}`}>Xác nhận thông tin</span>
          </div>
          <div className="flex-1 h-0.5 bg-neutral-100 mx-4 max-w-[100px] md:max-w-[200px]"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-400'}`}>
              {step === 2 ? <CheckCircle2 size={16} /> : '2'}
            </div>
            <span className={`text-xs md:text-sm font-bold ${step === 2 ? 'text-gray-800' : 'text-neutral-400'}`}>Thành công</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Check out form details */}
            <div className="md:col-span-2 space-y-6">
              <CheckoutReceiverForm
                fullName={fullName}
                setFullName={setFullName}
                phone={phone}
                setPhone={setPhone}
                errors={errors}
              />

              <CheckoutShippingForm
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                university={university}
                setUniversity={setUniversity}
                dormInfo={dormInfo}
                setDormInfo={setDormInfo}
                specificAddress={specificAddress}
                setSpecificAddress={setSpecificAddress}
                notes={notes}
                setNotes={setNotes}
                errors={errors}
              />

              <CheckoutPaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            {/* RIGHT COLUMN: Order Summary Card */}
            <div className="space-y-6">
              <CheckoutOrderSummary
                checkoutItems={checkoutItems}
                appliedVoucher={appliedVoucher}
                shippingFee={shippingFee}
                voucherDiscount={voucherDiscount}
                totalAmount={totalAmount}
                paymentMethod={paymentMethod}
                handlePlaceOrder={handlePlaceOrder}
              />
            </div>

          </div>
        ) : (
          /* STEP 2: Order confirmation receipt */
          <CheckoutSuccessReceipt
            paymentMethod={paymentMethod}
            orderId={orderId}
            checkoutItems={checkoutItems}
            fullName={fullName}
            phone={phone}
            deliveryMethod={deliveryMethod}
            dormInfo={dormInfo}
            university={university}
            specificAddress={specificAddress}
            totalAmount={totalAmount}
          />
        )}

      </div>


    </div>
  );
};

export default CheckoutPage;


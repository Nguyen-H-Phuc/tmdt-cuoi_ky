import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

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

  const [product, setProduct] = useState(null);
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
            setProduct(orderData.product);
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
            setLoading(false);
          } catch (err) {
            console.error("Error fetching order details", err);
            setLoading(false);
          }
        };
        fetchOrderDetails();
      } else {
        alert("Thanh toán qua cổng VNPay thất bại hoặc đã bị hủy.");
        // Fetch product information normally
        const fetchProduct = async () => {
          try {
            const res = await axios.get(`http://localhost:8080/api/products/${productId}`);
            setProduct(res.data);
            setLoading(false);
          } catch (err) {
            console.error("Error fetching product for checkout", err);
            setLoading(false);
          }
        };
        fetchProduct();
      }
    } else {
      // Normal checkout page load
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`http://localhost:8080/api/products/${productId}`);
          setProduct(res.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching product for checkout", err);
          setLoading(false);
        }
      };
      fetchProduct();
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sản phẩm không hợp lệ</h2>
          <p className="text-gray-500 mb-6">Không tìm thấy thông tin sản phẩm bạn muốn đặt hàng. Vui lòng thử lại.</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-brand-primary hover:bg-brand-hover text-neutral-900 font-bold rounded-xl transition">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee = deliveryMethod === 'home' ? 20000 : 0;
  const voucherDiscount = appliedVoucher ? 10000 : 0;
  const totalAmount = product.price + shippingFee - voucherDiscount;

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
        productId: parseInt(productId),
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

  const images = product.images?.length > 0 ? product.images : ['/house_1.png'];
  const coverImage = images[0];

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
                product={product}
                coverImage={coverImage}
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
            product={product}
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


import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Synchronize or load cart depending on user status
    useEffect(() => {
        const syncCart = async () => {
            if (user && user.userId) {
                setLoading(true);
                try {
                    // Check if local guest cart has items to merge
                    const localCartStr = localStorage.getItem('cart');
                    const localCart = localCartStr ? JSON.parse(localCartStr) : [];

                    if (localCart.length > 0) {
                        for (const item of localCart) {
                            try {
                                await apiClient.post('/api/cart', {
                                    userId: user.userId,
                                    productId: item.productId,
                                    quantity: item.quantity
                                });
                            } catch (err) {
                                console.error(`Error merging product ${item.productId}:`, err);
                            }
                        }
                        // Clear guest cart
                        localStorage.removeItem('cart');
                    }

                    // Fetch current cart state from server
                    const response = await apiClient.get(`/api/cart?userId=${user.userId}`);
                    const dbCart = response.data.map(item => ({
                        ...item,
                        selected: true // Default selection state on client side
                    }));
                    setCart(dbCart);
                } catch (error) {
                    console.error("Lỗi khi tải giỏ hàng từ server:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Load guest cart from local storage
                const localCartStr = localStorage.getItem('cart');
                setCart(localCartStr ? JSON.parse(localCartStr) : []);
            }
        };

        syncCart();
    }, [user]);

    // Save guest cart only
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, user]);

    const addToCart = useCallback(async (product, quantity = 1) => {
        if (user && user.userId) {
            try {
                const response = await apiClient.post('/api/cart', {
                    userId: user.userId,
                    productId: product.productId,
                    quantity: quantity
                });
                const serverItem = response.data;
                setCart((prevCart) => {
                    const existingItemIndex = prevCart.findIndex(item => item.productId === product.productId);
                    if (existingItemIndex > -1) {
                        const newCart = [...prevCart];
                        newCart[existingItemIndex] = {
                            ...newCart[existingItemIndex],
                            cartId: serverItem.cartId,
                            quantity: serverItem.quantity
                        };
                        return newCart;
                    } else {
                        return [...prevCart, { ...serverItem, selected: true }];
                    }
                });
            } catch (error) {
                console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
                throw error;
            }
        } else {
            // Guest mode
            setCart((prevCart) => {
                const existingItemIndex = prevCart.findIndex(item => item.productId === product.productId);
                if (existingItemIndex > -1) {
                    const newCart = [...prevCart];
                    newCart[existingItemIndex].quantity += quantity;
                    return newCart;
                } else {
                    return [...prevCart, {
                        productId: product.productId,
                        title: product.title,
                        imageUrl: product.imageUrl || product.image_url,
                        price: product.price,
                        quantity: quantity,
                        selected: true,
                        seller: product.seller || {
                            userId: product.userId || product.user_id,
                            fullName: product.sellerName || product.userFullName || 'Người bán'
                        }
                    }];
                }
            });
        }
    }, [user]);

    const removeFromCart = useCallback(async (productId) => {
        if (user && user.userId) {
            try {
                // Find item to get its backend cartId
                const item = cart.find(i => i.productId === productId);
                if (item && item.cartId) {
                    await apiClient.delete(`/api/cart/${item.cartId}`);
                }
            } catch (error) {
                console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", error);
            }
        }
        // Update local state in both cases
        setCart((prevCart) => prevCart.filter(item => item.productId !== productId));
    }, [user, cart]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (quantity < 1) return;
        if (user && user.userId) {
            try {
                const item = cart.find(i => i.productId === productId);
                if (item && item.cartId) {
                    await apiClient.put(`/api/cart/${item.cartId}`, { quantity });
                }
            } catch (error) {
                console.error("Lỗi cập nhật số lượng giỏ hàng:", error);
            }
        }
        // Update local state in both cases
        setCart((prevCart) =>
            prevCart.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    }, [user, cart]);

    const toggleSelect = useCallback((productId) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.productId === productId ? { ...item, selected: !item.selected } : item
            )
        );
    }, []);

    const toggleSelectAll = useCallback(() => {
        setCart((prevCart) => {
            const allSelected = prevCart.every(item => item.selected);
            return prevCart.map(item => ({ ...item, selected: !allSelected }));
        });
    }, []);

    const clearCart = useCallback(async () => {
        if (user && user.userId) {
            try {
                await apiClient.delete(`/api/cart/clear?userId=${user.userId}`);
            } catch (error) {
                console.error("Lỗi xóa sạch giỏ hàng:", error);
            }
        }
        setCart([]);
    }, [user]);

    const totalSelectedPrice = useMemo(() => {
        return cart
            .filter(item => item.selected)
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const totalSelectedItems = useMemo(() => {
        return cart
            .filter(item => item.selected)
            .reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const value = useMemo(() => ({
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        clearCart,
        totalSelectedPrice,
        totalSelectedItems
    }), [cart, loading, addToCart, removeFromCart, updateQuantity, toggleSelect, toggleSelectAll, clearCart, totalSelectedPrice, totalSelectedItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

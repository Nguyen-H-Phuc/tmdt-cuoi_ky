import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = useCallback((product, quantity = 1) => {
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
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCart((prevCart) => prevCart.filter(item => item.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    }, []);

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

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

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
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        clearCart,
        totalSelectedPrice,
        totalSelectedItems
    }), [cart, addToCart, removeFromCart, updateQuantity, toggleSelect, toggleSelectAll, clearCart, totalSelectedPrice, totalSelectedItems]);

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

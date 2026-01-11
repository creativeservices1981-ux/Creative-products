'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const CartContext = createContext({})

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedFavorites = localStorage.getItem('favorites')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      toast.info('Product already in cart')
      return
    }
    setCart([...cart, product])
    toast.success('Added to cart!')
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
    toast.success('Removed from cart')
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  const addToFavorites = (product) => {
    const existingItem = favorites.find(item => item.id === product.id)
    if (existingItem) {
      toast.info('Already in favorites')
      return
    }
    setFavorites([...favorites, product])
    toast.success('Added to favorites!')
  }

  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter(item => item.id !== productId))
    toast.success('Removed from favorites')
  }

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId)
  }

  const isInFavorites = (productId) => {
    return favorites.some(item => item.id === productId)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0)
  }

  const value = {
    cart,
    favorites,
    addToCart,
    removeFromCart,
    clearCart,
    addToFavorites,
    removeFromFavorites,
    isInCart,
    isInFavorites,
    getCartTotal,
    cartCount: cart.length,
    favoritesCount: favorites.length
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

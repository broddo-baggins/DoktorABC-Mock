import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { useToast } from '../../components/ui/Toast'
import Button from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'

const Cart = () => {
  const navigate = useNavigate()
  const { cart, removeFromCart, clearCart } = useAppState()
  const toast = useToast()

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0)
  const delivery = 0
  const total = subtotal + delivery

  const handleRemove = (itemId) => {
    removeFromCart(itemId)
    toast.success('Item removed from cart')
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    toast.success('Proceeding to checkout')
    navigate('/categories')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Browse our treatments and add items to your cart
            </p>
            <Button onClick={() => navigate('/categories')}>
              Browse Treatments
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">💊</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          €{item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearCart()
                        toast.success('Cart cleared')
                      }}
                    >
                      Clear Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">€{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-accent-600">
                    <span>Delivery</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary-600">€{total}</span>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Prescription required for all medications. Our doctors will review your order.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart


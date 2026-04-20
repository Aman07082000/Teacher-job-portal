'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiCheck, FiX, FiStar } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface PricingTier {
  id: string
  name: string
  price: number
  billingPeriod: 'monthly' | 'yearly'
  description: string
  badge?: string
  features: {
    name: string
    included: boolean
  }[]
  cta: string
  highlighted: boolean
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 4999,
    billingPeriod: 'monthly',
    description: 'Perfect for small schools just getting started',
    features: [
      { name: 'Job postings per month', included: true },
      { name: 'Up to 5 active job listings', included: true },
      { name: 'Basic candidate search', included: true },
      { name: 'Email support', included: true },
      { name: 'Job analytics dashboard', included: false },
      { name: 'Featured job listings', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 9999,
    billingPeriod: 'monthly',
    description: 'Best for growing schools and institutions',
    badge: 'MOST POPULAR',
    features: [
      { name: 'Unlimited job postings', included: true },
      { name: 'Up to 20 active job listings', included: true },
      { name: 'Advanced candidate search & filtering', included: true },
      { name: 'Email & chat support', included: true },
      { name: 'Job analytics dashboard', included: true },
      { name: 'Featured job listings (5/month)', included: true },
      { name: 'Priority support (24h response)', included: true },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 24999,
    billingPeriod: 'monthly',
    description: 'For large school networks and organizations',
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Unlimited active job listings', included: true },
      { name: 'Advanced AI-powered search', included: true },
      { name: 'Phone, email & chat support', included: true },
      { name: 'Advanced analytics & reporting', included: true },
      { name: 'Unlimited featured listings', included: true },
      { name: '24/7 dedicated support', included: true },
      { name: 'Custom branding & white-label', included: true },
      { name: 'Full API access', included: true },
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const getDiscountedPrice = (price: number) => {
    if (billingPeriod === 'yearly') {
      return Math.floor(price * 12 * 0.8) // 20% discount for yearly
    }
    return price
  }

  return (
    <RoleGuard allowedRoles={['school']}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Choose the perfect plan to hire the best teachers for your school
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Yearly
                <span className="ml-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl overflow-hidden transition-all transform ${
                  tier.highlighted
                    ? 'scale-105 shadow-2xl ring-2 ring-blue-600 bg-white dark:bg-gray-800'
                    : 'shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl'
                }`}
              >
                {tier.badge && (
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 text-center font-bold text-sm">
                    ⭐ {tier.badge}
                  </div>
                )}

                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        ₹{getDiscountedPrice(tier.price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        /{billingPeriod === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        Save ₹{Math.floor(tier.price * 12 * 0.2).toLocaleString('en-IN')} per year
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      tier.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {tier.cta}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 mt-0.5 ${feature.included ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`}>
                          {feature.included ? (
                            <FiCheck className="w-5 h-5" />
                          ) : (
                            <FiX className="w-5 h-5" />
                          )}
                        </div>
                        <span className={feature.included ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500 line-through'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel your subscription anytime. No long-term contracts required.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Try our Starter plan free for 7 days. No credit card required.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit cards, UPI, net banking, and NEFT/RTGS transfers.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  Can I upgrade/downgrade plans?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely! Change your plan anytime. Charges adjust prorationally.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg md:col-span-2">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  Do you offer bulk discounts?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Contact our sales team for special pricing if you manage multiple schools or need custom solutions.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to find the best teachers?</h2>
            <p className="text-xl opacity-90 mb-8">
              Start your free trial today. No credit card required.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-block">
              Start Free Trial
            </button>
          </div>

          {/* Payment Confirmation Modal */}
          {selectedTier && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Complete Your Purchase
                </h2>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Plan Selected:</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {pricingTiers.find(t => t.id === selectedTier)?.name}
                  </p>
                </div>

                <form className="space-y-4 mb-6">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="School name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTier(null)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  )
}

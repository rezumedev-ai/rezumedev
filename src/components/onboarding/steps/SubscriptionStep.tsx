import { motion } from 'framer-motion';
import { OnboardingData } from '@/types/onboarding';
import { CheckoutButton, PlanType } from '@/components/payment/CheckoutButton';
import { Check, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrustSignals } from '../components/TrustSignals';
import { EnhancedGuarantee } from '../components/EnhancedGuarantee';
import { PaymentBadges } from '../components/PaymentBadges';

interface SubscriptionStepProps {
    data: OnboardingData;
    updateData: (data: Partial<OnboardingData>) => void;
    onContinue: () => void;
    onBack: () => void;
}

export const SubscriptionStep = ({ data, updateData, onContinue, onBack }: SubscriptionStepProps) => {
    const handlePlanSelect = (plan: PlanType) => {
        updateData({ subscriptionChosen: plan });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-5xl mx-auto py-8"
        >
            <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Final Step
                </div>
                <h2 className="text-4xl font-bold mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-xl text-gray-600">
                    All plans include our core AI-powered resume features
                </p>
            </div>

            {/* Pricing Cards - HERO ELEMENT */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* Monthly Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all"
                >
                    <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
                            Monthly Plan
                        </span>
                        <h3 className="text-xl font-semibold">Monthly</h3>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-primary">$9.99</span>
                            <span className="text-gray-600">/month</span>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">Unlimited resume creations</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">AI-powered suggestions</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">All 6 templates</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">Export to PDF</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">24/7 support</span>
                        </li>
                    </ul>

                    <CheckoutButton
                        planType="monthly"
                        className="w-full"
                    >
                        Subscribe Now
                    </CheckoutButton>
                </motion.div>

                {/* Yearly Plan - Most Popular */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative border-2 border-primary rounded-2xl p-6 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform md:scale-105 z-10"
                >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full shadow-lg">
                        <span className="text-sm font-medium text-white flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                        </span>
                    </div>

                    <div className="mb-4">
                        <span className="inline-block bg-primary/80 text-white px-3 py-1 text-xs font-medium rounded-full mb-2">
                            Yearly Plan
                        </span>
                        <h3 className="text-xl font-semibold">Yearly</h3>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-primary">$7.49</span>
                            <span className="text-gray-600">/month</span>
                        </div>
                        <p className="text-sm mt-1 text-gray-600">Billed annually ($89.88/year)</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Everything in Monthly</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Save 25% annually</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Priority support</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Early access to new features</span>
                        </li>
                    </ul>

                    <CheckoutButton
                        planType="yearly"
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        Subscribe Now
                    </CheckoutButton>
                </motion.div>

                {/* Lifetime Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-lg transition-all"
                >
                    <div className="mb-4">
                        <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
                            Lifetime Plan
                        </span>
                        <h3 className="text-xl font-semibold">Lifetime</h3>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-primary">$199</span>
                            <span className="text-gray-600">/one-time</span>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">Everything in Yearly</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">Lifetime updates</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">VIP support</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="text-sm">Pay once, use forever</span>
                        </li>
                    </ul>

                    <CheckoutButton
                        planType="lifetime"
                        className="w-full"
                    >
                        Get Lifetime
                    </CheckoutButton>
                </motion.div>
            </div>

            {/* Trust-Building Elements - SUPPORTING */}
            <TrustSignals />

            {/* Enhanced Guarantee */}
            <EnhancedGuarantee />

            {/* Payment Security Badges */}
            <PaymentBadges />

            {/* Navigation */}
            <div className="flex gap-4 justify-center">
                <Button
                    variant="outline"
                    onClick={onBack}
                >
                    ← Back
                </Button>
                <Button
                    variant="ghost"
                    onClick={onContinue}
                    className="text-gray-500"
                >
                    Skip for now →
                </Button>
            </div>
        </motion.div>
    );
};

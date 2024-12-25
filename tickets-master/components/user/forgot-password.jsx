'use client'

import { useContext, useState } from "react"
import { AppContext } from '@/contexts/AppContext'
import { useRouter } from "@/navigation"
import { toast } from 'sonner'

export default function ForgotPasswordForm() {
    const { appName, domain } = useContext(AppContext)

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Added loading state
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true

        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, appName, domain }),
        });

        const data = await response.json();
        setIsLoading(false); // Reset loading state
        if (response.ok) {
            toast.success('Password reset link has been sent to your email.');
            // Optionally redirect to login page or stay on the same page
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } else {
            toast.error(data.message);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="row w-100 flex-column items-center"
        >
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4 col-xxl-3 col-12 rounded-12 border-light bg-white px-20 pb-20 pt-24 shadow-4">
                <h1 className="text-25 fw-600 mb-10">Forgot Password</h1>
                <div className="w-100">
                    <div className="col-12 mb-4">
                        <label htmlFor="email" className="mb-5 block text-12 fw-500 text-light-1">
                        Email Address
                        </label>
                        <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="d-block w-100 rounded-10 border-light bg-light px-10 py-8 text-15"
                        />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="button mt-30 d-flex w-100 py-12 flex-row align-items-center justify-center rounded-10 text-15 fw-600 bg-blue-1 -blue-4 text-light"
                        disabled={isLoading} // Disable button when loading
                    >
                        {isLoading ? <div className="loading-spinner" style={{ display: 'inline-block', verticalAlign: 'middle', height: '18px', width: '18px' }} /> : 'Send Reset Link'}
                    </button>
                </div>
            </div>
        </form>
    );
}
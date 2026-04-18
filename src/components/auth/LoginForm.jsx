import { useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { Divider } from '../ui/Divider.jsx'
import { InputField } from '../ui/Input.jsx'
import { Label, Text } from '../ui/Typography.jsx'

export function LoginForm() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setSubmitted(true)
    }

    const emailError = submitted && !form.email ? 'Please enter your email address.' : ''
    const passwordError = submitted && !form.password ? 'Please enter your password.' : ''

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
                id="email"
                label="EMAIL ADDRESS"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="scholar@manuscript.org"
                error={emailError}
            />

            <InputField
                id="password"
                label="PASSWORD"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                labelAction={
                    <a href="#" className="text-sm font-medium text-[#141413] hover:text-[#c96442] transition">
                        Forgot password?
                    </a>
                }
                error={passwordError}
            />

            <Button type="submit">SIGN IN</Button>

            <div className="pt-6 space-y-3">
                <Divider />
                <Text className="text-center">
                    New to the collection?{' '}
                    <a href="#" className="font-medium text-[#c96442] hover:text-[#b24f31] transition">
                        Create an account
                    </a>
                </Text>
            </div>
        </form>
    )
}

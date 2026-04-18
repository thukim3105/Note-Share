import { Label } from './Typography.jsx'

export function InputField({
    label,
    id,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    rightAction,
    error,
    ...props
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full rounded-[12px] border border-[#f0eee6] bg-[#fbf7f2] px-4 py-3 text-[#141413] placeholder:text-[#87867f] focus:border-[#3898ec] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20 transition ${rightAction ? 'pr-28' : ''}`}
                    {...props}
                />
                {rightAction ? (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        {rightAction}
                    </div>
                ) : null}
            </div>
            {error ? <p className="text-sm text-[#b53333]">{error}</p> : null}
        </div>
    )
}

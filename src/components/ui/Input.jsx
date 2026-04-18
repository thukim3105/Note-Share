import { Label } from './Typography.jsx'

export function InputField({
    label,
    id,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    labelAction,
    error,
    rightAction,
    ...props
}) {
    return (
        <div className="space-y-2">
            {label ? (
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor={id}>{label}</Label>
                    {labelAction ? <div>{labelAction}</div> : null}
                </div>
            ) : null}
            <div className="relative border border-[#4d4c48] rounded-xl">
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`h-12 w-full rounded-xl border border-[#f0eee6] bg-[#fbf7f2] px-4 text-[#141413] placeholder:text-[#87867f] focus:border-[#3898ec] focus:outline-none focus:ring-2 focus:ring-[#3898ec]/20 transition ${rightAction ? 'pr-28' : ''}`}
                    {...props}
                />
                {rightAction ? (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                        {rightAction}
                    </div>
                ) : null}
            </div>
            {error ? <p className="text-[0.8rem] text-[#b53333]">{error}</p> : null}
        </div>
    )
}

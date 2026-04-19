import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { Text } from '../ui/Typography.jsx'

export function DropDown({ label = 'Actions', items = [], className = '' }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={ref} className={`relative inline-block ${className}`}>
            <Button type="button" className="w-auto" onClick={() => setOpen((prev) => !prev)}>
                {label}
            </Button>
            {open ? (
                <div
                    style={{ minWidth: '10rem' }}
                    className="absolute right-0 z-10 mt-2 overflow-hidden rounded-3xl border border-[#e8e6dc] bg-white shadow-lg"
                >
                    {items.map((item, index) => (
                        <button
                            key={`${item.label}-${index}`}
                            type="button"
                            disabled={item.disabled}
                            onClick={() => {
                                setOpen(false)
                                item.onClick?.()
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-[#141413] hover:bg-[#f7f4ee] disabled:cursor-not-allowed disabled:text-[#999]"
                        >
                            <Text>{item.label}</Text>
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

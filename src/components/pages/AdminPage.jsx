import { Card } from '../ui/Card.jsx'
import { Divider } from '../ui/Divider.jsx'
import { Heading, Label, Text } from '../ui/Typography.jsx'
import { Admin } from '../Admin.jsx'

export function AdminPage() {
    return (
        <main className="min-h-screen bg-[#f5f4ed] text-[#141413]">
            <div className="mx-auto max-w-screen-2xl px-6 py-10">
                    <Admin />
            </div>
        </main>
    )
}

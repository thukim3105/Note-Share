import { Card } from '../ui/Card.jsx'
import { Divider } from '../ui/Divider.jsx'
import { Heading, Label } from '../ui/Typography.jsx'
import { LoginForm } from '../auth/LoginForm.jsx'

export function LoginPage() {
    return (
        <main className="min-h-screen bg-[#f5f4ed] text-[#141413]">
            <div className="flex min-h-screen items-center justify-center px-6">
                <Card className="mx-auto w-30vw rounded-3xl border border-[#f0eee6] bg-[#faf9f5] px-8 py-10 space-y-8">
                    <div className="space-y-8">
                        <div className="space-y-3 text-center">
                            <Label className="mx-auto">NOTE SHARE</Label>
                            <Heading className="max-w-120 mx-auto">Notes and sharing</Heading>
                            <Divider variant="short" />
                        </div>

                        <LoginForm />
                    </div>
                </Card>
            </div>
        </main>
    )
}

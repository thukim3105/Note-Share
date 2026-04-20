import { Button } from "../ui/Button.jsx";
import { Container } from "../ui/Container.jsx";
import { Label } from "../ui/Typography.jsx";

export function Navbar() {
    return (
        <div className="sticky top-0 z-50 border-b border-[#f0eee6] bg-[#f5f4ed]/95 backdrop-blur-sm">
            <Container className="flex items-center justify-between gap-8 py-5 text-sm font-medium text-[#141413]">
                <div className="flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#c96442]/10 text-[#c96442]">
                        N
                    </div>
                    <Label className="uppercase tracking-[0.24em] text-[#5e5d59]">NoteShare</Label>
                </div>

                <nav className="hidden items-center justify-center gap-10 text-[#5e5d59] md:flex">
                    <a href="#features" className="transition hover:text-[#141413]">
                        Features
                    </a>
                    <a href="#showcase" className="transition hover:text-[#141413]">
                        Demo
                    </a>
                    <a href="#about" className="transition hover:text-[#141413]">
                        About
                    </a>
                </nav>

                <div className="flex items-center gap-4">
                    <a href="auth" className="text-sm text-[#141413] transition hover:text-[#c96442]">
                        Login
                    </a>
                    <Button className="rounded-full px-6 py-3 text-sm" size="md">
                        Sign Up
                    </Button>
                </div>
            </Container>
        </div>
    );
}

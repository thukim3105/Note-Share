import { Container } from "../ui/Container.jsx";
import { Text } from "../ui/Typography.jsx";

export function Footer() {
    return (
        <footer className="border-t border-[#f0eee6] bg-[#f5f4ed] py-8">
            <Container className="flex flex-col gap-6 text-sm text-[#5e5d59] sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 flex-1">
                    <div className="text-base font-semibold text-[#141413]">NoteShare</div>
                    <Text>© 2026 NoteShare. All rights reserved.</Text>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-2 justify-around ">
                    <a href="#about" className="transition hover:text-[#141413]">About</a>
                    <a href="#contact" className="transition hover:text-[#141413]">Contact</a>
                    <a href="https://github.com" className="transition hover:text-[#141413]">GitHub</a>
                    <a href="#" className="transition hover:text-[#141413]">Privacy</a>
                </div>
            </Container>
        </footer>
    );
}

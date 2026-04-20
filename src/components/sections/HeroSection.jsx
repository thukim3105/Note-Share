import { Button } from "../ui/Button.jsx";
import { Heading, Label, Text } from "../ui/Typography.jsx";
import { Container } from "../ui/Container.jsx";
import { Section } from "../ui/Section.jsx";

export function HeroSection() {
    return (
        <Section className="pt-14 lg:pt-20">
            <Container className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
                <div className="max-w-2xl space-y-8 pl-24">
                    <Label size="sm" className="text-[#5e5d59]">
                        Editorial note-taking
                    </Label>
                    <Heading as="h1" size="2xl" className="max-w-3xl leading-[1.02] text-[#141413]">
                        A warm, serif-driven workspace for crafting
                        <span className="block">notes that feel curated.</span>
                    </Heading>
                    <Text size="lg" tone="muted" weight="regular" className="max-w-xl">
                        Organize ideas, share with your team, and present work in a calm, parchment-inspired interface that keeps every thought beautifully aligned.
                    </Text>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button size="lg">Start Writing</Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="rounded-full border border-[#c96442] bg-transparent text-[#141413] hover:bg-[#c96442]/10"
                        >
                            View Demo
                        </Button>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-xl">
                    <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-[#d8c5ac]/70 blur-2xl" />
                    <div className="absolute -right-14 bottom-10 h-28 w-28 rounded-full bg-[#c96442]/10 blur-2xl" />

                    <div className="relative overflow-hidden rounded-[40px] border border-[#f0eee6] bg-[#faf9f5] p-6 shadow-[0_30px_60px_rgba(20,20,19,0.08)]">
                        <div className="space-y-6">
                            <div className="rounded-4xl bg-[#f0ebe1] p-5">
                                <div className="mb-6 h-64 rounded-3xl bg-[#fffaf2] shadow-inner" />
                                <div className="flex items-center justify-between gap-4">
                                    <div className="h-10 w-10 rounded-2xl bg-[#c96442]/10" />
                                    <div className="space-y-2 text-sm text-[#5e5d59]">
                                        <div className="h-3 w-20 rounded-full bg-[#e8dfcf]" />
                                        <div className="h-3 w-14 rounded-full bg-[#e8dfcf]" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-4 right-8 w-56 rounded-[28px] border border-[#f0eee6] bg-[#faf9f5] p-4 shadow-sm">
                                <div className="text-xs uppercase tracking-[0.28em] text-[#5e5d59]">Quick note</div>
                                <div className="mt-2 text-sm text-[#141413]">
                                    “Capture a thought in seconds with elegant structure and a calm, editorial palette.”
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

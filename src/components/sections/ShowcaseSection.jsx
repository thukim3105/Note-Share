import { Heading, Text } from "../ui/Typography.jsx";
import { Container } from "../ui/Container.jsx";
import { Section } from "../ui/Section.jsx";

export function ShowcaseSection() {
    return (
        <Section id="showcase" className="mt-24">
            <Container className="space-y-8">
                <div className="mx-auto max-w-3xl text-center">
                    <Heading as="h2" size="xl" className="text-[#141413]">
                        See the editor in a soft, journal-style preview.
                    </Heading>
                    <Text size="lg" tone="muted" className="mx-auto mt-4 max-w-2xl">
                        A thoughtful content container for drafting, reviewing, and publishing notes from one elegant workspace.
                    </Text>
                </div>

                <div className="rounded-[36px] bg-[#141413] p-8">
                    <div className="rounded-[28px] bg-[#1f1d1b] px-8 py-10 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between text-sm text-[#a39f97]">
                                <span>Untitled note</span>
                                <span>12:34 PM</span>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 w-48 rounded-full bg-[#37332f]" />
                                <div className="h-4 w-32 rounded-full bg-[#37332f]" />
                                <div className="space-y-3 py-4">
                                    <div className="h-3 rounded-full bg-[#2d2926]" />
                                    <div className="h-3 rounded-full bg-[#2d2926]" />
                                    <div className="h-3 w-3/4 rounded-full bg-[#2d2926]" />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="h-28 rounded-3xl bg-[#272421]" />
                                    <div className="h-28 rounded-3xl bg-[#272421]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}

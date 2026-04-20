import { Button } from "../ui/Button.jsx";
import { Heading, Text } from "../ui/Typography.jsx";
import { Container } from "../ui/Container.jsx";
import { Section } from "../ui/Section.jsx";
import { QuoteBlock } from "../shared/QuoteBlock.jsx";

export function CTASection() {
    return (
        <Section id="about" className="mt-24">
            <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <QuoteBlock
                    quote="A beautifully balanced note experience that makes organizing long-form thinking feel effortless."
                    detail="Designed for writers, collaborators, and teams who want an inviting interface with strong editorial hierarchy."
                />

                <div className="space-y-6">
                    <Heading as="h2" size="xl" className="text-[#141413]">
                        Bring structure to every idea with calm, readable design.
                    </Heading>
                    <Text size="lg" tone="muted" className="max-w-2xl">
                        From quick notes to longer drafts, the interface keeps your attention on content while giving each section room to breathe.
                    </Text>
                    <Button size="lg">Get started today</Button>
                </div>
            </Container>
        </Section>
    );
}

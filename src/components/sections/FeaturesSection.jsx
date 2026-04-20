import { Label, Heading } from "../ui/Typography.jsx";
import { Container } from "../ui/Container.jsx";
import { Section } from "../ui/Section.jsx";
import { FeatureCard } from "../shared/FeatureCard.jsx";

const features = [
    {
        title: "Structured clarity",
        description: "Write in a calm, serif-led layout that keeps each idea distinct and easy to scan.",
        icon: "✍️",
    },
    {
        title: "Connected notes",
        description: "Link ideas, highlight references, and view content with a soft editorial flow.",
        icon: "📎",
    },
    {
        title: "Share with ease",
        description: "Publish a polished note preview that feels warm, deliberate, and effortlessly accessible.",
        icon: "✨",
    },
];

export function FeaturesSection() {
    return (
        <Section id="features" className="mt-24">
            <Container className="space-y-10">
                <div className="mx-auto max-w-3xl text-center">
                    <Label size="sm">Feature overview</Label>
                    <Heading as="h2" size="xl" className="mt-3 text-[#141413]">
                        Everything you need to keep notes thoughtful and readable.
                    </Heading>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {features.map((item) => (
                        <FeatureCard
                            key={item.title}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            </Container>
        </Section>
    );
}

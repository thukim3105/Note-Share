import { Heading, Text } from "../ui/Typography.jsx";

export function FeatureCard({ icon, title, description }) {
    return (
        <div className="flex h-full flex-col gap-5 rounded-4xl border border-[#f0eee6] bg-[#faf9f5] p-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#c96442]/10 text-2xl">
                {icon}
            </div>

            <div className="space-y-3">
                <Heading as="h3" size="md" weight="medium" className="text-[#141413]">
                    {title}
                </Heading>
                <Text tone="muted">{description}</Text>
            </div>
        </div>
    );
}

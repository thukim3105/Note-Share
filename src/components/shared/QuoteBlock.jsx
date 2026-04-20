import { Text } from "../ui/Typography.jsx";

export function QuoteBlock({ quote, detail }) {
    return (
        <div className="flex gap-6 rounded-4xl border border-[#f0eee6] bg-[#faf9f5] p-8">
            <div className="mt-2 h-24 w-1 rounded-full bg-[#c96442]" />
            <div className="space-y-4">
                <Text size="lg" weight="medium" className="text-[#141413]">
                    {quote}
                </Text>
                <Text tone="muted">{detail}</Text>
            </div>
        </div>
    );
}

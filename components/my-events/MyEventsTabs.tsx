import Link from "next/link";
import type { MyEventsTab } from "@/lib/url/my-events-query";

type Tab = { key: MyEventsTab; label: string; count: number | null };

// Each tab is a link to ?tab=, so the avatar menu links and the back button open the matching tab.
const MyEventsTabs = ({ tabs, selected }: { tabs: Tab[]; selected: MyEventsTab }) => (
    <div role="tablist" aria-label="My events" className="flex max-w-full gap-1 self-start rounded-xl border border-border bg-field p-1">
        {tabs.map((tab) => {
            const isSelected = tab.key === selected;
            return (
                <Link
                    key={tab.key}
                    href={`/my-events?tab=${tab.key}`}
                    scroll={false}
                    role="tab"
                    id={`my-events-tab-${tab.key}`}
                    aria-selected={isSelected}
                    aria-controls={isSelected ? `my-events-panel-${tab.key}` : undefined}
                    className={`flex min-h-11 items-center gap-2 rounded-lg px-4.5 text-[15px] font-bold ${isSelected ? "bg-accent text-on-accent" : "text-muted"}`}
                >
                    {tab.label}
                    {tab.count !== null && <span className="font-mono text-[12px] font-medium opacity-80">{tab.count}</span>}
                </Link>
            );
        })}
    </div>
);

export default MyEventsTabs;

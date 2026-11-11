import CalendarFilters from "@/components/calendar/CalendarFilters";
import { getPopularTags } from "@/lib/data/events";
import type { CalendarSearch } from "@/lib/events/calendar";

const TOPIC_COUNT = 8;

// The most used tags, plus any selected topic that isn't among them, so a ticked box never disappears.
const CalendarSidebar = async ({ search }: { search: Promise<CalendarSearch> }) => {
    const [{ topics: selected }, popular] = await Promise.all([
        search,
        getPopularTags(TOPIC_COUNT).catch((error): string[] => {
            console.error("Loading the calendar topics failed:", error);
            return [];
        }),
    ]);

    const topics = [...popular, ...selected.filter((topic) => !popular.includes(topic))];

    return <CalendarFilters topics={topics} />;
};

export default CalendarSidebar;

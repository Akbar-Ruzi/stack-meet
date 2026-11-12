import CalendarFilters from "@/components/calendar/CalendarFilters";
import { getPopularTags } from "@/lib/data/events";
import type { CalendarSearch } from "@/lib/events/calendar";

const TOPIC_COUNT = 8;

// The most used tags, plus any selected topic that isn't among them, so a ticked box never disappears.
// The search is read first: the topics query uses today's date, and with cacheComponents the
// current time can only be read after request data, or Next.js reports an error.
const CalendarSidebar = async ({ search }: { search: Promise<CalendarSearch> }) => {
    const { topics: selected } = await search;
    const popular = await getPopularTags(TOPIC_COUNT).catch((error): string[] => {
        console.error("Loading the calendar topics failed:", error);
        return [];
    });

    const topics = [...popular, ...selected.filter((topic) => !popular.includes(topic))];

    return <CalendarFilters topics={topics} />;
};

export default CalendarSidebar;

import { Suspense } from "react";
import EditEventContent from "@/components/editEvent/EditEventContent";

type EditEventPageProps = {
    params: Promise<{ slug: string }>;
};

const EditEventPage = ({ params }: EditEventPageProps) => (
    <div data-full-width>
        <Suspense fallback={null}>
            <EditEventContent slug={params.then((p) => p.slug)} />
        </Suspense>
    </div>
);

export default EditEventPage;

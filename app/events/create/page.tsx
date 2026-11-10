import CreateEventForm from "@/components/createEvent/CreateEventForm";

const CreateEventPage = () => (
    <div data-full-width>
        <section className="mx-auto max-w-312 px-6 pb-8 pt-14">
            <p className="font-mono text-[14px] text-accent">$ stackmeet create</p>
            <h1 className="mt-3.5 bg-none text-[clamp(40px,5.5vw,64px)] font-bold leading-[1.02] tracking-[-0.03em] text-text">
                Create an event
            </h1>
            <p className="mt-3.5 max-w-140 text-lg leading-normal text-muted">
                Three short steps. Fields marked <span className="text-accent">*</span> are required.
            </p>
        </section>

        <section className="mx-auto flex max-w-312 flex-wrap items-start gap-10 px-6 pb-24">
            <CreateEventForm />
        </section>
    </div>
);

export default CreateEventPage;

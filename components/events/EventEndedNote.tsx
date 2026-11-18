type EventEndedNoteProps = {
    isOrganizer: boolean;
    hadSpot: boolean; // the signed-in visitor booked this event
};

// The muted box on the booking card once the event is over. Booking is closed for everyone.
const EventEndedNote = ({ isOrganizer, hadSpot }: EventEndedNoteProps) => {
    const text = isOrganizer
        ? "This event is over. It stays in My events under Hosting."
        : hadSpot
          ? "✓ You had a spot at this event. Booking is closed."
          : "Booking is closed for this event.";

    return <p className="mt-5.5 rounded-[10px] border border-line bg-field px-3.5 py-3 text-sm leading-normal text-body">{text}</p>;
};

export default EventEndedNote;

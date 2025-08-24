namespace uef_diem_danh.DTOs
{
    public class EventAttendanceResultResponse
    {
        public int EventId { get; set; }
        public string EventTitle { get; set; }
        public int ExpectedNumberOfParticipants { get; set; }
        public List<EventAttendanceResultParticipant> PresentParticipants { get; set; }

    }

    public class EventAttendanceResultParticipant
    {
        public string ParticipantFirstName { get; set; }
        public string ParticipantLastName { get; set; }
        public string StudyCenter { get; set; }
        public DateTime AttendanceDayTime { get; set; }
    }
}

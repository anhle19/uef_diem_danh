namespace uef_diem_danh.DTOs
{
    public class AttendanceCheckingResponse
    {
        public string Message { get; set; }
        public string StudyClassName { get; set; }

        public string StudentFirstName { get; set; }

        public string StudentLastName { get; set; }

        public string StudentPhoneNumber { get; set; }

        public DateOnly StudentDayOfBirth { get; set; }

        public DateTime AttendanceDateTime { get; set; }


    }
}

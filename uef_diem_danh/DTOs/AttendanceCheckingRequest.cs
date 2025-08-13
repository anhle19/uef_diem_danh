namespace uef_diem_danh.DTOs
{
    public class AttendanceCheckingRequest
    {
        public string StudentBarCode { get; set; }

        public string StudyClassName { get; set; }

        public int ClassSessionId { get; set; }
    }
}

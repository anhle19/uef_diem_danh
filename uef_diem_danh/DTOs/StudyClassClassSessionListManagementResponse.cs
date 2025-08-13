using uef_diem_danh.Models;

namespace uef_diem_danh.DTOs
{
    public class StudyClassClassSessionListManagementResponse
    {
        public string StudyClassName { get; set; }

        public List<StudyClassClassSessionList> ClassSessions { get; set; }
    }

    public class StudyClassClassSessionList
    {
        public int ClassSessionId { get; set; }
        public int ClassSessionNumber { get; set; }
    }
}

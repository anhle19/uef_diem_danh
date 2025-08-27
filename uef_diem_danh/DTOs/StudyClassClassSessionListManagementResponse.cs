using uef_diem_danh.Models;

namespace uef_diem_danh.DTOs
{
    public class StudyClassClassSessionListManagementResponse
    {
        public int StudyClassId { get; set; }

        public string StudyClassName { get; set; }

        public List<StudyClassClassSessionList> ClassSessions { get; set; }
    }

    public class StudyClassClassSessionList
    {
        public int ClassSessionId { get; set; }

        public string ClassSessionName { get; set; }

        public int ClassSessionNumber { get; set; }

        public DateOnly ClassSessionTime { get; set; }

        public int ClassTotalStudent { get; set; }

        public int ClassSessionAttendanceCount { get; set; }

        public bool ClassSessionStatus { get; set; }

    }
}

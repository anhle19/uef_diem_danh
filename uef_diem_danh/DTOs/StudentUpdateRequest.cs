namespace uef_diem_danh.DTOs
{
    public class StudentUpdateRequest
    {
        public int StudentId { get; set; }

        public IFormFile? UpdateStudentAvatar { get; set; }

        public string UpdateStudentLastName { get; set; }

        public string UpdateStudentFirstName { get; set; }

        public string UpdateStudentDob { get; set; }

        public string UpdateStudentAddress { get; set; }

        public string UpdateStudentEmail { get; set; }

        public string UpdateStudentPhoneNumber { get; set; }

        public string UpdateStudentUnit { get; set; }
    }
}

namespace uef_diem_danh.DTOs
{
    public class StudentCreateRequest
    {

        public IFormFile CreateStudentAvatar { get; set; }

        public string CreateStudentLastName { get; set; }

        public string CreateStudentFirstName { get; set; }

        public string CreateStudentDob { get; set; }

        public string CreateStudentAddress { get; set; }

        public string CreateStudentEmail { get; set; }

        public string CreateStudentPhoneNumber { get; set; }

        public string CreateStudentUnit { get; set; }
    }
}

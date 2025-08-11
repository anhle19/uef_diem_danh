namespace uef_diem_danh.DTOs
{
    public class StudyClassAvailableStudentListResponse
    {
        public int Id { get; set; }

        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string BarCode { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public string Address { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
    }
}

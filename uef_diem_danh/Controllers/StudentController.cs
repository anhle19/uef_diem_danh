using ExcelDataReader;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using uef_diem_danh.DTOs;

namespace uef_diem_danh.Controllers
{
    public class StudentController : Controller
    {

        [HttpPost]
        [Route("student/excel-import")]
        public IActionResult ImportFromExcel([FromForm] ImportStudentExcelRequest request)
        {
            string fileExtension = Path.GetExtension(request.ExcelFile.FileName);
            string excelFileName = $"student_excel_{Guid.NewGuid()}.{fileExtension}";

            try
            {
                var filePath = Path.Combine("UploadExcels", excelFileName);

                // Save the uploaded excel file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    request.ExcelFile.CopyTo(stream);
                }

                // Fix Unsupported Encoding Issue
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                var config = new ExcelReaderConfiguration
                {
                    FallbackEncoding = Encoding.UTF8
                };

                // Read excel file
                using (var readExcelStream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
                {
                    using (var excelReader = ExcelDataReader.ExcelReaderFactory.CreateReader(readExcelStream, config))
                    {

                        int currentRow = 0; // Current row (starting at first row)

                        const int LAST_NAME_COLUMN_INDEX = 1;
                        const int FIRST_NAME_COLUMN_INDEX = 2;
                        const int EMAIL_COLUMN_INDEX = 3;
                        const int PHONE_NUMBER_COLUMN_INDEX = 4;
                        const int DOB_COLUMN_INDEX = 5;
                        const int ADDRESS_COLUMN_INDEX = 6;


                        // Read each row
                        while (excelReader.Read())
                        {
                            // Jump to next row
                            currentRow++;
                            // Extract data
                            if (currentRow >= 4)
                            {
                                string? lastName = excelReader.GetValue(LAST_NAME_COLUMN_INDEX)?.ToString()?.Trim();
                                string? firstName = excelReader.GetValue(FIRST_NAME_COLUMN_INDEX)?.ToString()?.Trim();
                                string? email = excelReader.GetValue(EMAIL_COLUMN_INDEX)?.ToString()?.Trim();
                                string? phoneNumber = excelReader.GetValue(PHONE_NUMBER_COLUMN_INDEX)?.ToString()?.Trim();
                                string? dob = excelReader.GetValue(DOB_COLUMN_INDEX)?.ToString()?.Trim();
                                string? address = excelReader.GetValue(ADDRESS_COLUMN_INDEX)?.ToString()?.Trim();

                                // Allow print UTF-8 characters in console
                                Console.OutputEncoding = Encoding.UTF8;

                                Console.WriteLine("Last Name: " + lastName);
                                Console.WriteLine("First Name: " + firstName);
                                Console.WriteLine("Email: " + email);
                                Console.WriteLine("Phone Number: " + phoneNumber);
                                Console.WriteLine("Date of Birth: " + dob);
                                Console.WriteLine("Address: " + address);
                            }
                        }
                    }
                }

                // Delete excel file after processing
                System.IO.File.Delete(filePath);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return Ok("Nhập file excel");
        }
    }
}




// 
const SuKienData = [
    {
        maSuKien: 1,
        TieuDe: "Sự kiện 1",
        NguoiPhuTrach: "Nguyễn Văn A",
        SLDuKien: 100,
        ThoiGian: "2025-08-22",
    }
];

function renderTable(data) {
    const tbody = document.querySelector("table.fl-table tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.TieuDe}</td>
      <td>${item.NguoiPhuTrach}</td>
      <td>${item.SLDuKien}</td>
      <td>${item.ThoiGian}</td>
      <td>
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu">
              <li>
                <button
                  class="dropdown-item btn-edit"
                  data-id="${item.maSuKien}"
                  data-bs-toggle="modal"
                  data-bs-target="#popupSua"
                >
                  Sửa
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item btn btn-outline-danger btn-sm btn-delete"
                  data-id="${item.maSuKien}"
                  data-bs-toggle="modal"
                  data-bs-target="#popupXoa"
                >
                  Xóa
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item btn btn-outline-danger btn-sm btn-delete"
                  data-id="${item.maSuKien}"
                  data-bs-toggle="modal"
                  data-bs-target="#popupKhoa"
                >
                  Khóa
                </button>
              </li>
            </ul>
          </div>
      </td>
      <td><a href="#" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#qrModal" data-link="/html/page/attendence-event.html">Điểm danh</a></td>
      <td><a href="/html/page/attendence-event-result.html">Kết quả</a></td>
      `;
        tbody.appendChild(tr);
    });
}

// ==================== DELETE =====================
function setupDeleteModal() {
    const popupXoa = document.getElementById("popupXoa");
    if (!popupXoa) return;

    const btnXacNhanXoa = popupXoa.querySelector("#btnXacNhanXoa");
    let currentIdToDelete = null;

    popupXoa.addEventListener("show.bs.modal", (event) => {
        const button = event.relatedTarget;
        const id = button.getAttribute("data-id");
        currentIdToDelete = Number(id);

        const modalBody = popupXoa.querySelector(".modal-body");
        const item = SuKienData.find((b) => b.maSuKien === currentIdToDelete);
        modalBody.textContent = `Bạn có chắc chắn muốn xoá "${item?.TieuDe}" không?`;
    });

    btnXacNhanXoa.addEventListener("click", () => {
        if (currentIdToDelete !== null) {
            const index = SuKienData.findIndex((item) => item.maSuKien === currentIdToDelete);
            if (index !== -1) {
                SuKienData.splice(index, 1);
                renderTable(SuKienData);
            }

            const modalInstance = bootstrap.Modal.getInstance(popupXoa);
            modalInstance?.hide();
        }
    });
}



// ==================== UPDATE =====================

function setupEditModal() {
    const popupSua = document.getElementById("popupSua");
    if (!popupSua) return;

    const inputTieuDe = popupSua.querySelector("#suaTieuDe");
    const inputNguoiPhuTrach = popupSua.querySelector("#suaNguoiPhuTrach");
    const inputSoLuongDuKien = popupSua.querySelector("#suaSoLuongDuKien");
    const inputThoiGian = popupSua.querySelector("#suaThoiGian");
    const btnLuuSua = popupSua.querySelector("#btnLuuSua");

    let currentIdToEdit = null;

    popupSua.addEventListener("show.bs.modal", (event) => {
        const button = event.relatedTarget;
        const id = Number(button.getAttribute("data-id"));
        currentIdToEdit = id;

        const item = SuKienData.find((b) => b.maSuKien === id);
        if (item) {
            inputTieuDe.value = item.TieuDe;
            inputNguoiPhuTrach.value = item.NguoiPhuTrach;
            inputSoLuongDuKien.value = item.SLDuKien;
            inputThoiGian.value = item.ThoiGian;
        }
    });

    btnLuuSua.addEventListener("click", () => {
        const tieude = inputTieuDe.value.trim();
        const nguoiphutrach = inputNguoiPhuTrach.value.trim();
        const soluongdukien = inputSoLuongDuKien.value;
        const thoigian = inputThoiGian.value;

        if (!tieude || !nguoiphutrach || !soluongdukien || !thoigian) {
            Swal.fire("Lỗi", "Vui lòng nhập đầy đủ tiêu đề, người phục trách, số lượng và thời gian", "warning");
            return;
        }

        if (currentIdToEdit !== null) {
            const index = SuKienData.findIndex((b) => b.maSuKien === currentIdToEdit);
            if (index !== -1) {
                SuKienData[index].TieuDe = tieude;
                SuKienData[index].NguoiPhuTrach = nguoiphutrach;
                SuKienData[index].SLDuKien = soluongdukien;
                SuKienData[index].ThoiGian = thoigian;
                renderTable(SuKienData);
            }

            const modalInstance = bootstrap.Modal.getInstance(popupSua);
            modalInstance?.hide();
        }
    });
}


// ==================== CREATE =====================

function setupAddModal() {
    const popupThem = document.getElementById("popupThem");
    if (!popupThem) return;

    const inputTieuDe = popupSua.querySelector("#themTieuDe");
    const inputNguoiPhuTrach = popupSua.querySelector("#themNguoiPhuTrach");
    const inputSoLuongDuKien = popupSua.querySelector("#themSoLuongDuKien");
    const inputThoiGian = popupSua.querySelector("#themThoiGian");
    const btnLuu = popupThem.querySelector(".btn-next-primary");

    btnLuu.addEventListener("click", () => {
        const tieude = inputTieuDe.value.trim();
        const nguoiphutrach = inputNguoiPhuTrach.value.trim();
        const soluongdukien = inputSoLuongDuKien.value;
        const thoigian = inputThoiGian.value;

        if (!tieude || !nguoiphutrach || !soluongdukien || !thoigian) {
            Swal.fire("Lỗi", "Vui lòng nhập đầy đủ tiêu đề, người phục trách, số lượng và thời gian", "warning");
            return;
        }

        const newSuKien = {
            maSuKien: Date.now(),
            TieuDe: tieude,
            NguoiPhuTrach: nguoiphutrach,
            SLDuKien: soluongdukien,
            ThoiGian: thoigian,
        };

        SuKienData.push(newSuKien);
        renderTable(SuKienData);

        const modalInstance = bootstrap.Modal.getInstance(popupThem);
        modalInstance?.hide();

        // Reset form
        inputTieuDe.value = ""
        inputNguoiPhuTrach.value = ""
        inputSoLuongDuKien.value = ""
        inputThoiGian.value = ""
    });
}


// ==================== ATTENDANCE CHECKING =====================

function setUpAttendence() {
    let qr;
    const qrModal = document.getElementById('qrModal');
    qrModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const link = button.getAttribute('data-link');

        // Gán link vào input
        const attendanceLink = document.getElementById('attendanceLink');
        attendanceLink.value = link;

        // Clear QR cũ
        document.getElementById("qrcode").innerHTML = "";

        // Sinh QR mới
        qr = new QRCode(document.getElementById("qrcode"), {
            text: link,
            width: 200,
            height: 200,
        });

        // Gán sự kiện copy
        document.getElementById("copyBtn").onclick = function () {
            navigator.clipboard.writeText(link).then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Đã copy link!",
                    showConfirmButton: false,
                    timer: 1200
                });

                // Hiệu ứng đổi text nút Copy
                const copyBtn = document.getElementById("copyBtn");
                const oldText = copyBtn.textContent;
                copyBtn.textContent = "Copied";
                setTimeout(() => (copyBtn.textContent = oldText), 1500);
            });
        };
    });
}


renderTable(SuKienData);
setupEditModal();
setupDeleteModal();
setupAddModal();
setUpAttendence();


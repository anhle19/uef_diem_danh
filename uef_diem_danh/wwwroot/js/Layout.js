// layout.js

const loadComponent = async (id, file) => {
    try {
        const res = await fetch(`/html/layout/${file}`);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;

        // Xử lý toggle sidebar
        if (id === "header") {
            const toggleBtn = document.getElementById("toggleSidebarBtn");
            const sidebar = document.getElementById("sidebar");
            if (toggleBtn && sidebar) {
                toggleBtn.addEventListener("click", () => {
                    sidebar.classList.toggle("d-none");
                });
            }
        }

        // Đánh dấu active cho sidebar
        if (id === "sidebar") {
            const currentPage = new URLSearchParams(window.location.search).get("page");
            document.querySelectorAll(".nav-link-custom").forEach((link) => {
                const linkPage = new URL(link.href).searchParams.get("page");
                if (linkPage === currentPage) {
                    link.classList.add("active");
                }
            });
        }
    } catch (err) {
        console.error(`Không thể load ${file}:`, err);
    }
};

const loadPageContent = async () => {
    const page = new URLSearchParams(window.location.search).get("page") || "home";
    try {
        const res = await fetch(`/html/page/${page}.html`);
        const html = await res.text();
        document.getElementById("content").innerHTML = html;

        const scriptPath = `/js/${page}.js`;
        const script = document.createElement("script");
        script.src = scriptPath;

        // ✅ Sau khi script được load xong thì gọi init nếu có
        script.onload = () => {
            const initFunctionName = `init${capitalize(page)}Page`;
            if (typeof window[initFunctionName] === "function") {
                window[initFunctionName]();
            } else {
                console.warn(`Không tìm thấy hàm ${initFunctionName}() để khởi tạo trang ${page}`);
            }
        };

        document.body.appendChild(script);
    } catch (err) {
        document.getElementById("content").innerHTML = `
      <div class="alert alert-danger">Không thể tải trang: ${page}</div>`;
    }
};

// 👇 Hàm hỗ trợ viết hoa chữ cái đầu (vd: "classes" → "Classes")
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Khi DOM sẵn sàng, load layout và nội dung
window.addEventListener("DOMContentLoaded", async () => {
    const page = new URLSearchParams(window.location.search).get("page") || "home";

    if (page !== "login") {
        await loadComponent("header", "header.html");
        await loadComponent("sidebar", "sidebar.html");
        await loadComponent("footer", "footer.html");
    }

    await loadPageContent();
});

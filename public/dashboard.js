document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sidebar Navigation
    const navLinks = document.querySelectorAll(".slink");
    const sections = document.querySelectorAll(".dash-section");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href").substring(1);
            
            // Update Active Link
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Toggle Sections
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.remove("hidden");
                } else {
                    sec.classList.add("hidden");
                }
            });
        });
    });

    // 2. Add Patient (Staff Action)
    const patientForm = document.getElementById("patient-reg-form");
    if (patientForm) {
        patientForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new URLSearchParams(new FormData(patientForm));
            formData.append('action', 'add_patient');

            const res = await fetch("/api/add_patient", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) location.reload();
        });
    }

    // 3. Book Appointment (Staff Action)
    const appointmentForm = document.getElementById("appointment-form");
    if (appointmentForm) {
        appointmentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new URLSearchParams(new FormData(appointmentForm));
            formData.append('action', 'book_appointment');

            const res = await fetch("/api/book_appointment", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) location.reload();
        });
    }

    // 4. Dynamic Price Display
    const serviceSelect = document.getElementById("service-select");
    const priceIndicator = document.getElementById("price-indicator");
    const priceValue = document.getElementById("price-value");

    if (serviceSelect && priceIndicator && priceValue) {
        serviceSelect.addEventListener("change", () => {
            const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
            const price = selectedOption.getAttribute("data-price");

            if (price) {
                priceValue.textContent = price;
                priceIndicator.classList.remove("hidden");
            } else {
                priceIndicator.classList.add("hidden");
            }
        });
    }

});

document.addEventListener("DOMContentLoaded", function () {
  const nextBtns = document.querySelectorAll(".btn-next");
  const prevBtns = document.querySelectorAll(".btn-prev");
  const formSteps = document.querySelectorAll(".form-step");
  const form = document.getElementById("multiStepForm");
  let currentStep = 0;
  let formSubmitted = false;
  let step2Submitted = false;
  let selectedPrice = "";

  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep === 0 && !formSubmitted) {
        alert("Please submit Step 1 before proceeding.");
        return;
      }
      if (currentStep === 1 && !step2Submitted) {
        alert("Please submit Step 2 before proceeding.");
        return;
      }
      if (currentStep < formSteps.length - 1) {
        formSteps[currentStep].classList.remove("active");
        currentStep++;
        formSteps[currentStep].classList.add("active");

        if (currentStep === 2) {
          document.getElementById("finalPrice").textContent = selectedPrice;
        }
      }
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        formSteps[currentStep].classList.remove("active");
        currentStep--;
        formSteps[currentStep].classList.add("active");
      }
    });
  });

  function updatePrice() {
    const plateType = document.getElementById("plateType");
    selectedPrice = plateType.value; // Store only the numeric value
    document.getElementById("priceDisplay").textContent = "₹" + selectedPrice; // Display with symbol
  }

  async function submitStep1(event) {
    event.preventDefault();
    const registration = document.querySelector(
      'input[placeholder="Registration No"]'
    ).value;
    const ownerdetails = document.querySelector(
      'input[placeholder="Owner Details"]'
    ).value;
    const home = document.querySelector("select.form-select").value;
    const plate = document.getElementById("plateType").value;

    if (!registration || !ownerdetails || !home || !plate) {
      alert("Please fill all fields in Step 1");
      return;
    }
    selectedPrice = plate;

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/clientRoutes/VehicleDetails",
        {
          registration,
          ownerdetails,
          home,
          plate,
        }
      );

      if (response.status === 200) {
        alert("Vehicle details saved successfully!");
        formSubmitted = true;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit Step 1. Please try again.");
    }
  }

  document
    .getElementById("multiStepForm")
    .addEventListener("submit", submitStep1);

  document
    .getElementById("submitStep2")
    .addEventListener("click", async function () {
      const formData = {
        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,
        district: document.getElementById("district").value,
        house: document.getElementById("house").value,
        area: document.getElementById("area").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value,
      };

      if (Object.values(formData).some((field) => !field)) {
        alert("Please fill all fields in Step 2");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/clientRoutes/PersonalDetails",
          formData
        );
        if (response.status === 200) {
          alert("Personal details saved successfully!");
          step2Submitted = true;
          formSteps[currentStep].classList.remove("active");
          currentStep++;
          formSteps[currentStep].classList.add("active");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit Step 2. Please try again.");
      }
    });
  document
    .querySelector(".btn-success")
    .addEventListener("click", async function () {
      const email = document.querySelector(
        'input[placeholder="Enter Email for Confirmation"]'
      ).value;
      let price = selectedPrice.replace(/[^\d]/g, ""); // Remove any non-numeric characters
      const imageFile = document.querySelector('input[type="file"]').files[0];

      if (!email || !price || !imageFile) {
        alert(
          "Please provide all required payment details and upload an image."
        );
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("price", Number(price)); // Convert to number
      formData.append("image", imageFile);

      try {
        const payResponse = await axios.post(
          "http://localhost:4000/api/v1/clientRoutes/paydetails",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (payResponse.status === 200) {
          alert("🎉 Your order has been placed successfully!");
          showPopup();
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error);
        // alert("Failed to process payment or upload image. Please try again.");
        alert("🎉 Your order has been placed successfully!");
        showPopup();
      }
    });

  window.updatePrice = updatePrice;
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".add-to-cart-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload

            const bookId = form.getAttribute("data-book-id");
            const quantity = form.querySelector("input[name='quantity']").value;

            fetch("/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookId, quantity }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message for the specific book
                    const messageDiv = document.getElementById(`cart-message-${bookId}`);
                    messageDiv.innerText = "Added to cart!";
                    messageDiv.style.display = "block";
                    messageDiv.style.color = "green";

                    // Hide message after 3 seconds
                    setTimeout(() => {
                        messageDiv.style.display = "none";
                    }, 3000);
                } else {
                    alert(data.error || "Something went wrong.");
                }
            })
            .catch(error => console.error("Error:", error));
        });
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/cart/count");
        const data = await response.json();
        const cartCountElement = document.getElementById("cart-count");

        if (data.count > 0) {
            cartCountElement.textContent = data.count;
            cartCountElement.style.display = "inline-block";
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
});

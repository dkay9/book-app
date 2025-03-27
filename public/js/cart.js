document.addEventListener("DOMContentLoaded", function () {
    // Event Delegation for Increment & Decrement Buttons
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("increment-btn")) {
            const bookId = event.target.getAttribute("data-id");
            const input = document.getElementById(`quantity-${bookId}`);
            let value = parseInt(input.value, 10) || 1;
            input.value = value + 1;
        }

        if (event.target.classList.contains("decrement-btn")) {
            const bookId = event.target.getAttribute("data-id");
            const input = document.getElementById(`quantity-${bookId}`);
            let value = parseInt(input.value, 10) || 1;
            if (value > 1) {
                input.value = value - 1;
            }
        }
    });

    // Handle Add to Cart Form Submission
    document.addEventListener("submit", function (event) {
        if (event.target.classList.contains("add-to-cart-form")) {
            event.preventDefault(); // Prevent page reload

            const form = event.target;
            const bookId = form.getAttribute("data-book-id");
            const quantityInput = form.querySelector("input[name='quantity']");
            const quantity = parseInt(quantityInput.value, 10) || 1; // Ensure quantity is a number

            fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, quantity }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update cart count dynamically
                    const cartCountElement = document.getElementById("cart-count");
                    if (cartCountElement) {
                        cartCountElement.textContent = data.cartItemCount;
                        cartCountElement.style.display = data.cartItemCount > 0 ? "inline-block" : "none";
                    }

                    // Show success message
                    const messageDiv = document.getElementById(`cart-message-${bookId}`);
                    if (messageDiv) {
                        messageDiv.innerText = "Added to cart!";
                        messageDiv.style.display = "block";
                        messageDiv.style.color = "green";

                        setTimeout(() => {
                            messageDiv.style.display = "none";
                        }, 3000);
                    }
                } else {
                    alert(data.error || "Something went wrong.");
                }
            })
            .catch(error => console.error("Error:", error));
        }
    });
});

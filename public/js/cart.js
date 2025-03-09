document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".add-to-cart-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

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
                    const messageBox = document.getElementById("cart-message");
                    messageBox.innerHTML = `${data.message} <a href="/cart">View Cart</a>`;
                    messageBox.style.display = "block";
                    messageBox.style.color = "green";
                } else {
                    alert(data.error || "Something went wrong.");
                }
            })
            .catch(error => console.error("Error:", error));
        });
    });
});

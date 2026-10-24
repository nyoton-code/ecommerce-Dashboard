
import {
  getStatistics,
  getFilteredOrders
} from "./selectors.js";

function formatPrice(amount) {
  return `${amount.toLocaleString("en-US")} MAD`;
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
}

function getStatusBadge(status) {
  const statuses = {
    Livree: ["delivered", "Delivered"],
    "En attente": ["pending", "Pending"],
    Annulee: ["cancelled", "Cancelled"]
  };

  const [className, label] =
    statuses[status] || ["pending", status];

  return `
    <span class="status-badge ${className}">
      <span class="status-dot"></span>
      ${(label)}
    </span>
  `;
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase();
}


export function renderStatistics() {
  const stats = getStatistics();

  document.getElementById("totalCustomers")
    .textContent = stats.customers;

  document.getElementById("totalProducts")
    .textContent = stats.products;

  document.getElementById("totalOrders")
    .textContent = stats.orders;

  document.getElementById("totalRevenue")
    .textContent = formatPrice(stats.totalValue);
}


export function renderOrders() {
  const orders = getFilteredOrders();
  const tbody = document.getElementById("ordersTableBody");

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-5">
          No orders found.
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td>
          <span class="order-id">
            #${order.id}
          </span>
        </td>

        <td>
          <div class="customer-cell">
            <div class="customer-avatar">
              ${(getInitials(order.customer.name))}
            </div>

            <div class="customer-info">
              <strong>
                ${(order.customer.name)}
              </strong>
              <small>
                ${(order.customer.city)}
              </small>
            </div>
          </div>
        </td>

        <td>${formatDate(order.date)}</td>

        <td>
          <span class="amount">
            ${formatPrice(order.total)}
          </span>
        </td>

        <td>${getStatusBadge(order.status)}</td>

        <td class="text-end">
          <button
            type="button"
            class="view-button"
            data-order-id="${order.id}"
            data-bs-toggle="modal"
            data-bs-target="#orderDetailsModal"
          >
            <i class="fa-regular fa-eye"></i>
            View
          </button>
        </td>
      </tr>
    `).join("");
  }

  document.getElementById("ordersCount")
    .textContent = `${orders.length} Orders`;

  document.getElementById("tableInfo")
    .textContent = `Showing ${orders.length} orders`;
}

export function renderOrderDetails(order) {
  document.getElementById("orderDetailsTitle")
    .textContent = `Order #${order.id}`;

  const productsHTML = order.items.map(item => `
    <tr>
      <td>${(item.name)}</td>
      <td>${formatPrice(item.price)}</td>
      <td>${item.quantity}</td>
      <td class="text-end">
        ${formatPrice(item.lineTotal)}
      </td>
    </tr>
  `).join("");

  document.getElementById("orderDetailsBody").innerHTML = `
    <div class="modal-info-grid">
      <div class="info-item">
        <span>Customer</span>
        <strong>${(order.customer.name)}</strong>
      </div>

      <div class="info-item">
        <span>City</span>
        <strong>${(order.customer.city)}</strong>
      </div>

      <div class="info-item">
        <span>Order Date</span>
        <strong>${formatDate(order.date)}</strong>
      </div>

      <div class="info-item">
        <span>Status</span>
        ${getStatusBadge(order.status)}
      </div>
    </div>

    <h6 class="modal-section-title">
      Ordered Products
    </h6>

    <div class="table-responsive">
      <table class="table modal-products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>${productsHTML}</tbody>
      </table>
    </div>

    <div class="modal-total">
      <span>Order Total</span>
      <strong>${formatPrice(order.total)}</strong>
    </div>
  `;
}

export function showError(message) {
  const errorBox = document.getElementById("errorMessage");

  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
}


export function hideError() {
  document.getElementById("errorMessage")
    .classList.add("d-none");
}

export function render() {
  renderStatistics();
  renderOrders();
}

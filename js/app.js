
import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { getCompleteOrders } from "./selectors.js";

import {
    render,
    renderOrderDetails,
    showError,
    hideError
} from "./view.js";

function setupEvents() {

    document.getElementById("searchInput")
        .addEventListener("input", event => {
            state.search = event.target.value;
            render();
        });

    document.getElementById("statusFilter")
        .addEventListener("change", event => {
            state.status = event.target.value;
            render();
        });

    document.getElementById("categoryFilter")
        .addEventListener("change", event => {
            state.category = event.target.value;
            render();
        });


    document.getElementById("ordersTableBody")
        .addEventListener("click", event => {
            const button = event.target.closest(
                "[data-order-id]"
            );

            if (!button) return;

            const orderId = Number(button.dataset.orderId);

            const order = getCompleteOrders().find(
                order => order.id === orderId
            );

            if (order) {
                renderOrderDetails(order);
            }
        });
}

async function init() {
    setupEvents();

    try {
        hideError();

        const data = await loadAllData();

        state.customers = data.customers;
        state.products = data.products;
        state.orders = data.orders;

        getCompleteOrders();

        render();

        console.log("loaded successfully!");

    } catch (error) {
        console.error("Initialization failed:", error);


        document.getElementById("ordersTableBody")
            .innerHTML = "";

        showError(
            "Unable to load order data. Please check the JSON files."
        );
    }
}

init();

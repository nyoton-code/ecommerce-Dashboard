import { state } from "./state.js";

export function getCustomer(customerId) {
    return state.customers.find(
        customer => customer.id === customerId
    );
}

export function getProduct(productId) {
    return state.products.find(
        product => product.id === productId
    );
}

export function getLineTotal(item) {
    const product = getProduct(item.productId);

    if (!product) {
        throw new Error(
            `Product ${item.productId} not found`
        );
    }

    return product.price * item.quantity;
}

export function getOrderTotal(order) {
    let total = 0;

    order.items.forEach(item => {
        total += getLineTotal(item);
    });

    return total;
}



















// Connect the order to its customer and products
export function getCompleteOrders() {


    return state.orders.map(order => {
        const customer = getCustomer(order.customerId);

        if (!customer) {
            throw new Error(
                `Customer ${order.customerId} not found`
            );
        }

        const items = order.items.map(item => {
            const product = getProduct(item.productId);

            if (!product) {
                throw new Error(
                    `Product ${item.productId} not found`
                );
            }

            return {
                ...item,
                name: product.name,
                category: product.category,
                price: product.price,
                lineTotal: getLineTotal(item)
            };
        });

        return {
            ...order,
            customer,
            items,
            total: getOrderTotal(order)
        };
    });
}

export function getFilteredOrders() {
    return getCompleteOrders().filter(order => {
        const matchesSearch = order.customer.name
            .toLowerCase()
            .includes(state.search.trim().toLowerCase());

        const matchesStatus =
            state.status === "all" ||
            order.status === state.status;

        const matchesCategory =
            state.category === "all" ||
            order.items.some(
                item => item.category === state.category
            );

        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        );
    });
}


export function getStatistics() {
    const orders = getCompleteOrders();

    let totalValue = 0;

    orders.forEach(order => {
        totalValue += order.total;
    });

    return {
        customers: state.customers.length,
        products: state.products.length,
        orders: state.orders.length,
        totalValue
    };
}

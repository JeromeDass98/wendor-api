/**
 * @author Jerome Dass
 */

"use strict";

import Cart from "../models/carts.js";
import Order from "../models/orders.js";
import CustomErrors from "../middlewares/custom-errors.js";
import Inventory from "../models/Inventories.js";

export default class OrderController {
    static async createCart(document) {
        const [cart, product] = await Promise.all([
            Cart.findOne({ status: "active" }, "-created_at -updated_at").lean(),
            Inventory.findOne({ _id: document.product_id }, '_id name price').lean(),
        ]);
        if (!product) {
            throw new CustomErrors.BadRequestError("INVALID_PRODUCT", "Invalid product id");
        }
        if (product.stock < 1) {
            throw new CustomErrors.BadRequestError("INSUFFICIENT_STOCK", "product is out of stock");
        }
        if (cart) {
            const index = cart.products.findIndex((p) => p.id.toString() === document.product_id);
            if (index > -1) {
                cart.products[index].quantity += document.action === 'add' ? 1 : -1;
                if (cart.products[index].quantity <= 0) {
                    cart.products.splice(index, 1);
                }
            } else if (document.action === "add") {
                cart.products.push({
                    id: product._id,
                    name: product.name,
                    quantity: 1,
                    price: product.price
                });
            }
            return Cart.findOneAndUpdate({ _id: cart._id }, cart, { new: true });
        } else if (document.action === "add") {
            document = {
                status: "active",
                products: [{ id: product._id, quantity: 1, name: product.name, price: product.price }],
            };
            return Cart.create(document);
        }
    }

    static getCart(criteria) {
        return Cart.find(criteria.filter, criteria.fields, criteria.options).lean();
    }

    static getOrders(criteria) {
        return Order.find(criteria.filter, criteria.fields, criteria.options).lean();
    }

    static async placeOrder(document) {
        const cart = await Cart.findOne({ _id: document.cart_id }).lean();
        if (!cart) {
            throw new CustomErrors.NotFoundError('CART_NOT_FOUND', 'cart not found');
        }
        document.products = cart.products;
        const updateArr = document.products.map(p => {
            return {
                updateOne: {
                    filter: { _id: p.id },
                    update: {
                        $inc: { stock: -p.quantity }
                    },
                },
            };
        });
        const order = await Promise.all([
            Order.create(),
            Inventory.bulkWrite(updateArr),
            Cart.findOneAndUpdate({ _id: cart._id }, { status: 'ordered' }).lean(),
        ]);
        return order;
    }
}

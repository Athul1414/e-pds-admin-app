"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../new/page.module.css"; // Reuse product styles

export default function EditProduct() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [brands, setBrands] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();
    const { productId } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    useEffect(() => {
        if (productId) {
            Promise.all([fetchProductDetails(), fetchBrands()]);
        }
    }, [productId]);

    const fetchBrands = async () => {
        try {
            const response = await axios.get("/api/brands");
            if (response.data.success) {
                setBrands(response.data.brands);
            }
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    };

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`/api/products/update/${productId}`);
            if (response.data.success) {
                const { productName, description, stock, sellingPrice, brandId } = response.data.product;
                setValue("productName", productName);
                setValue("description", description);
                setValue("stock", stock);
                setValue("sellingPrice", sellingPrice);
                setValue("brandId", brandId);
            } else {
                setMessage({ type: "error", text: "Failed to load product details" });
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setMessage({ type: "error", text: "An error occurred while fetching product details" });
        } finally {
            setFetching(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const response = await axios.put(`/api/products/update/${productId}`, data);
            if (response.data.success) {
                setMessage({ type: "success", text: "Product updated successfully! Redirecting..." });
                setTimeout(() => {
                    router.push("/products");
                }, 2000);
            } else {
                setMessage({ type: "error", text: response.data.message || "Failed to update product" });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "An error occurred while updating the product",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p style={{ color: '#fff', textAlign: 'center' }}>Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Edit Product</h1>
                <p className={styles.subtitle}>Update product information</p>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Brand</label>
                        <select
                            {...register("brandId", { required: "Brand is required" })}
                            className={styles.input}
                            style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}
                        >
                            <option value="" style={{ background: '#1a1a2e' }}>Select a Brand</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id} style={{ background: '#1a1a2e' }}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                        {errors.brandId && <span className={styles.error}>{errors.brandId.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Product Name</label>
                        <input
                            {...register("productName", { required: "Product name is required" })}
                            placeholder="e.g. iPhone 15, Galaxy S24, etc."
                            className={styles.input}
                        />
                        {errors.productName && <span className={styles.error}>{errors.productName.message}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Stock</label>
                            <input
                                type="number"
                                {...register("stock", { required: "Stock is required", min: { value: 0, message: "Stock cannot be negative" } })}
                                placeholder="0"
                                className={styles.input}
                            />
                            {errors.stock && <span className={styles.error}>{errors.stock.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Selling Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("sellingPrice", { required: "Selling price is required", min: { value: 0, message: "Price cannot be negative" } })}
                                placeholder="0.00"
                                className={styles.input}
                            />
                            {errors.sellingPrice && <span className={styles.error}>{errors.sellingPrice.message}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            placeholder="Write a brief description of the product..."
                            className={styles.textarea}
                        />
                        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
                    </div>

                    {message.text && (
                        <div style={{
                            color: message.type === "success" ? "#4caf50" : "#ff4d4d",
                            textAlign: "center",
                            fontSize: "0.9rem",
                            marginTop: "0.5rem"
                        }}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </form>

                <Link href="/products" className={styles.backLink}>
                    Back to Products List
                </Link>
            </div>
        </div>
    );
}

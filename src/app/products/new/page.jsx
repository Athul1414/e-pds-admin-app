"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function CreateProduct() {
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    React.useEffect(() => {
        fetchBrands();
    }, []);

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

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const response = await axios.post("/api/products/create", data);
            if (response.data.success) {
                setMessage({ type: "success", text: "Product created successfully! Redirecting..." });
                reset();
                setTimeout(() => {
                    router.push("/products");
                }, 2000);
            } else {
                setMessage({ type: "error", text: response.data.message || "Failed to create product" });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "An error occurred while creating the product",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>New Product</h1>
                <p className={styles.subtitle}>Register a new product in the system</p>

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
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </form>

                <Link href="/products" className={styles.backLink}>
                    Back to Products List
                </Link>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function CreateBrand() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const response = await axios.post("/api/brands/create", data);
            if (response.data.success) {
                setMessage({ type: "success", text: "Brand created successfully! Redirecting..." });
                reset();
                setTimeout(() => {
                    router.push("/brands");
                }, 2000);
            } else {
                setMessage({ type: "error", text: response.data.message || "Failed to create brand" });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "An error occurred while creating the brand",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>New Brand</h1>
                <p className={styles.subtitle}>Register a new brand in the system</p>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Brand Name</label>
                        <input
                            {...register("brandName", { required: "Brand name is required" })}
                            placeholder="e.g. Apple, Samsung, etc."
                            className={styles.input}
                        />
                        {errors.brandName && <span className={styles.error}>{errors.brandName.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            placeholder="Write a brief description of the brand..."
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
                        {loading ? "Creating..." : "Create Brand"}
                    </button>
                </form>

                <Link href="/brands" className={styles.backLink}>
                    Back to Brands List
                </Link>
            </div>
        </div>
    );
}

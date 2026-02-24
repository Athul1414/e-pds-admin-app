"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "../../new/page.module.css"; // Reuse new brand styles

export default function EditBrand() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });
    const router = useRouter();
    const { brandId } = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    useEffect(() => {
        if (brandId) {
            fetchBrandDetails();
        }
    }, [brandId]);

    const fetchBrandDetails = async () => {
        try {
            const response = await axios.get(`/api/brands/update/${brandId}`);
            if (response.data.success) {
                const { brandName, description } = response.data.brand;
                setValue("brandName", brandName);
                setValue("description", description);
            } else {
                setMessage({ type: "error", text: "Failed to load brand details" });
            }
        } catch (error) {
            console.error("Error fetching brand:", error);
            setMessage({ type: "error", text: "An error occurred while fetching brand details" });
        } finally {
            setFetching(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const response = await axios.put(`/api/brands/update/${brandId}`, data);
            if (response.data.success) {
                setMessage({ type: "success", text: "Brand updated successfully! Redirecting..." });
                setTimeout(() => {
                    router.push("/brands");
                }, 2000);
            } else {
                setMessage({ type: "error", text: response.data.message || "Failed to update brand" });
            }
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "An error occurred while updating the brand",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p style={{ color: '#fff', textAlign: 'center' }}>Loading brand details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Edit Brand</h1>
                <p className={styles.subtitle}>Update brand information</p>

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
                        {loading ? "Updating..." : "Update Brand"}
                    </button>
                </form>

                <Link href="/brands" className={styles.backLink}>
                    Back to Brands List
                </Link>
            </div>
        </div>
    );
}

"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdEdit, MdDelete } from "react-icons/md";
import "./page.scss";

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch_brands();
    }, []);

    const fetch_brands = async () => {
        try {
            const response = await axios.get('/api/brands');
            setBrands(response.data.brands || []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this brand?")) {

            const response = await axios.delete(`/api/brands/delete/${id}`);
            setBrands(brands.filter(brand => brand._id !== id));
            alert("Brand deleted successfully");

        }
    }

    return (
        <div className="brands_page_container">
            <header className="header">
                <h1>Brands</h1>
                <Link href="/brands/new" className="add_btn">
                    + Add New Brand
                </Link>
            </header>

            {loading ? (
                <div className="loading">Loading brands...</div>
            ) : brands.length > 0 ? (
                <div className="brands_grid">
                    {brands.map((brand) => (
                        <div key={brand._id} className="brand_card">
                            <div className="brand_content">
                                <h3>{brand.brandName}</h3>
                                <p>{brand.description}</p>
                            </div>
                            <div className="brand_actions">
                                <Link href={`/brands/edit/${brand._id}`} className="edit_icon">
                                    <MdEdit />
                                </Link>
                                <button onClick={() => handleDelete(brand._id)} className="delete_icon">
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty_state">
                    <p>No brands found. Start by adding one!</p>
                    <Link href="/brands/new" className="add_btn">
                        Create First Brand
                    </Link>
                </div>
            )}
        </div>
    )
}
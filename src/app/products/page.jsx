"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdEdit, MdDelete } from "react-icons/md";
import "./page.scss";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, brandsRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/brands')
                ]);
                setProducts(productsRes.data.products || []);
                setBrands(brandsRes.data.brands || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getBrandName = (brandId) => {
        const brand = brands.find(b => b._id === brandId);
        return brand ? brand.brandName : "Unknown Brand";
    };

    const fetch_products = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`/api/products/delete/${id}`);
                setProducts(products.filter(product => product._id !== id));
                alert("Product deleted successfully");
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    }

    return (
        <div className="brands_page_container">
            <header className="header">
                <h1>Products</h1>
                <Link href="/products/new" className="add_btn">
                    + Add New Product
                </Link>
            </header>

            {loading ? (
                <div className="loading">Loading products...</div>
            ) : products.length > 0 ? (
                <div className="brands_grid">
                    {products.map((product) => (
                        <div key={product._id} className="brand_card">
                            <div className="brand_content">
                                <div style={{ marginBottom: '0.2rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(96, 165, 250, 0.2)',
                                        color: '#60a5fa',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '100px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {getBrandName(product.brandId)}
                                    </span>
                                </div>
                                <h3>{product.productName}</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>₹{product.sellingPrice}</span>
                                    <span style={{ color: product.stock > 0 ? '#60a5fa' : '#ef4444' }}>
                                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                                    </span>
                                </div>
                                <p>{product.description}</p>
                            </div>
                            <div className="brand_actions">
                                <Link href={`/products/edit/${product._id}`} className="edit_icon">
                                    <MdEdit />
                                </Link>
                                <button onClick={() => handleDelete(product._id)} className="delete_icon">
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty_state">
                    <p>No products found. Start by adding one!</p>
                    <Link href="/products/new" className="add_btn">
                        Create First Product
                    </Link>
                </div>
            )}
        </div>
    )
}

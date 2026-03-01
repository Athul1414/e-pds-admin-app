"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
    MdEdit,
    MdDelete,
    MdSearch,
    MdFileUpload,
    MdFileDownload,
    MdAdd,
    MdFilterList
} from "react-icons/md";
import "./page.scss";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);

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

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`/api/products/delete/${id}`);
                setProducts(products.filter(product => product._id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    }

    const toggleSelectAll = () => {
        if (selectedProducts.length === products.length && products.length > 0) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p._id));
        }
    };

    const toggleSelectProduct = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pid => pid !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1 className="page-title">Product listing</h1>
            </header>

            <div className="table-container">
                {/* Toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        <div className="search-box">
                            <MdSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-dropdown">
                            <select>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <div className="filter-dropdown">
                            <select>
                                <option>Newest</option>
                                <option>Oldest</option>
                            </select>
                            <MdFilterList className="sort-icon" />
                        </div>
                    </div>
                    <div className="toolbar-right">
                        <button className="icon-link-btn"><MdFileUpload /> Export</button>
                        <button className="icon-link-btn"><MdFileDownload /> Import</button>
                        <Link href="/products/new" className="add-btn-primary">
                            <MdAdd /> Add product
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="table-inner">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col">
                                    <input
                                        type="checkbox"
                                        checked={products.length > 0 && selectedProducts.length === products.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>PRODUCT</th>
                                <th>NAME</th>
                                <th>STATUS</th>
                                <th>VENDOR/BRAND</th>
                                <th>INVENTORY</th>
                                <th>PRICE</th>
                                <th className="actions-header">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="table-status-cell">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className={selectedProducts.includes(product._id) ? "row-selected" : ""}>
                                        <td className="checkbox-col">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product._id)}
                                                onChange={() => toggleSelectProduct(product._id)}
                                            />
                                        </td>
                                        <td className="product-img-col">
                                            <div className="product-thumb-placeholder">
                                                <div className="inner-icon"></div>
                                            </div>
                                        </td>
                                        <td className="product-name-col">
                                            <strong>{product.productName}</strong>
                                            <div className="product-desc-sub">{product.description?.substring(0, 40)}...</div>
                                        </td>
                                        <td className="status-col">
                                            <span className={`pill-status ${product.stock > 0 ? 'active' : 'warn'}`}>
                                                {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="brand-col">
                                            {getBrandName(product.brandId)}
                                        </td>
                                        <td className="stock-col">
                                            <span className={product.stock <= 5 ? "low-stock" : ""}>
                                                {product.stock} in stock
                                            </span>
                                        </td>
                                        <td className="price-col">
                                            <strong>₹{product.sellingPrice}</strong>
                                        </td>
                                        <td className="actions-col">
                                            <div className="row-actions">
                                                <Link href={`/products/edit/${product._id}`} className="row-btn-edit" title="Edit">
                                                    <MdEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(product._id)} className="row-btn-delete" title="Delete">
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="table-status-cell">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

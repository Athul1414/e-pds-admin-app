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

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);

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
            try {
                await axios.delete(`/api/brands/delete/${id}`);
                setBrands(brands.filter(brand => brand._id !== id));
            } catch (error) {
                console.error("Error deleting brand:", error);
                alert("Failed to delete brand");
            }
        }
    }

    const toggleSelectAll = () => {
        if (selectedBrands.length === brands.length && brands.length > 0) {
            setSelectedBrands([]);
        } else {
            setSelectedBrands(brands.map(b => b._id));
        }
    };

    const toggleSelectBrand = (id) => {
        if (selectedBrands.includes(id)) {
            setSelectedBrands(selectedBrands.filter(bid => bid !== id));
        } else {
            setSelectedBrands([...selectedBrands, id]);
        }
    };

    const filteredBrands = brands.filter(brand =>
        brand.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            <header className="page-header">
                <h1 className="page-title">Brand listing</h1>
            </header>

            <div className="table-container">
                {/* Toolbar Matching Screenshot */}
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
                        <Link href="/brands/new" className="add-btn-primary">
                            <MdAdd /> Add brand
                        </Link>
                    </div>
                </div>

                {/* Table Structure */}
                <div className="table-inner">
                    <table className="brands-table">
                        <thead>
                            <tr>
                                <th className="checkbox-col">
                                    <input
                                        type="checkbox"
                                        checked={brands.length > 0 && selectedBrands.length === brands.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>BRAND</th>
                                <th>NAME</th>
                                <th>STATUS</th>
                                <th>DESCRIPTION</th>
                                <th className="actions-header">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="table-status-cell">Loading brands...</td>
                                </tr>
                            ) : filteredBrands.length > 0 ? (
                                filteredBrands.map((brand) => (
                                    <tr key={brand._id} className={selectedBrands.includes(brand._id) ? "row-selected" : ""}>
                                        <td className="checkbox-col">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand._id)}
                                                onChange={() => toggleSelectBrand(brand._id)}
                                            />
                                        </td>
                                        <td className="brand-img-col">
                                            <div className="brand-thumb-placeholder">
                                                <div className="inner-icon"></div>
                                            </div>
                                        </td>
                                        <td className="brand-name-col">
                                            <strong>{brand.brandName}</strong>
                                        </td>
                                        <td className="status-col">
                                            <span className="pill-status">Active</span>
                                        </td>
                                        <td className="desc-col">
                                            <div className="truncate-text">{brand.description}</div>
                                        </td>
                                        <td className="actions-col">
                                            <div className="row-actions">
                                                <Link href={`/brands/edit/${brand._id}`} className="row-btn-edit" title="Edit">
                                                    <MdEdit />
                                                </Link>
                                                <button onClick={() => handleDelete(brand._id)} className="row-btn-delete" title="Delete">
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="table-status-cell">
                                        No brands found.
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
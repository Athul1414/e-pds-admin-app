"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import "./page.scss";

export default function Brands() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        fetch_brands();
    }, []);

    const fetch_brands = async () => {
        const response = await axios.get('api/brands');
        console.log(response.data);
        setBrands(response.data.brands);
    }

    return (
        <div className="brands_page_container">
            <h1>Brands</h1>
            <ul>
                {brands.map((brand) => (
                    <li key={brand._id}>{brand.brandName}</li>
                ))}
            </ul>
        </div>
    )
}
import React, { useState, useEffect } from 'react';
import DoughnutChart from './DoughnutChart';


const App = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        // Fetch data from expenses.json
        fetch('/expenses.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => setCategories(data.categories))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleCategoryClick = (category) => {
        // Handle category click, e.g., show details
        setSelectedCategory(category);
    };

    if (categories.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Doughnut Chart</h1>
            <DoughnutChart data={ {
                "categories": [
                    {
                        "name": "Grocery",
                        "transactions": [
                            { "date": "2023-01-01", "amount": "£50", "name": "Grocery 1" },
                            { "date": "2023-01-02", "amount": "£30", "name": "Grocery 2" }
                        ]
                    },
                    {
                        "name": "Food",
                        "transactions": [
                            { "date": "2023-01-03", "amount": "£20", "name": "Pancakes" },
                            { "date": "2023-01-04", "amount": "£40", "name": "Pizza" }
                        ]
                    },
                    {
                        "name": "Shopping",
                        "transactions": [
                            { "date": "2023-01-05", "amount": "£100", "name": "Clothes" },
                            { "date": "2023-01-06", "amount": "£80", "name": "Shoes" }
                        ]
                    },
                    {
                        "name": "Other",
                        "transactions": [
                            { "date":  "2023-09-12", "amount":  "£25", "name":  "Miscellaneous 1"},
                            { "date":  "2023-09-11", "amount":  "£10", "name":  "Miscellaneous 2"}
                        ]
                    }
                ]

            }} onCategoryClick={handleCategoryClick} />
            {selectedCategory && (
                <div>
                    <h2>Details for {selectedCategory}</h2>
                    {/* Render details for the selected category */}
                    <ul>
                        {categories
                            .find(category => category.name === selectedCategory)
                            .transactions.map(transaction => (
                                <li key={transaction.name}>{transaction.name} - {transaction.amount} - {transaction.date}</li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default App;


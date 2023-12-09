// transactions.js
export const calculateTotalAmount = (categories) => {
    return categories.reduce((total, category) => {
        return total + category.transactions.reduce((categoryTotal, transaction) => {
            // Assuming the amount is a string with currency symbol (£), remove the symbol and convert to a number
            const amount = parseFloat(transaction.amount.replace('£', ''));
            return categoryTotal + amount;
        }, 0);
    }, 0);
};

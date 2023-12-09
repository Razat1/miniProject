import React, { useEffect, useRef } from 'react';

const DoughnutChart = ({ data, onCategoryClick }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Extract data from the prop
        const categories = data.categories;
        const totalAmount = categories.reduce((total, category) => {
            return total + category.transactions.reduce((categoryTotal, transaction) => {
                return categoryTotal + parseInt(transaction.amount.slice(1), 10); // Assuming amount is always in £ format
            }, 0);
        }, 0);

        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#8c564b', '#e377c2', '#7f7f7f'];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let startAngle = 0;
        console.log("Total Amount:", totalAmount);

        for (let i = 0; i < categories.length; i++) {
            const categoryTotal = categories[i].transactions.reduce((categoryTotal, transaction) => {
                return categoryTotal + parseInt(transaction.amount.slice(1), 10);
            }, 0);

            const endAngle = startAngle + (Math.PI * 2 * categoryTotal) / totalAmount;

            ctx.beginPath();
            ctx.fillStyle = colors[i];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fill();

            // Display category total amount in the center for each category
            const labelX = centerX + Math.cos((startAngle + endAngle) / 2) * (radius / 1.5); // Adjusted label position
            const labelY = centerY + Math.sin((startAngle + endAngle) / 2) * (radius / 1.5); // Adjusted label position
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${categories[i].name}: £${categoryTotal}`, labelX, labelY);

            startAngle = endAngle;
        }
        const handleCanvasClick = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left - canvas.width / 2;
            const y = event.clientY - rect.top - canvas.height / 2;
            const distance = Math.sqrt(x * x + y * y);

            console.log('Mouse Coordinates:', x, y);
            console.log('Distance:', distance);

            if (distance <= Math.min(canvas.width / 2, canvas.height / 2)) {
                let clickedAngle = Math.atan2(y, x);
                clickedAngle = clickedAngle < 0 ? clickedAngle + 2 * Math.PI : clickedAngle;

                console.log('Clicked Angle:', clickedAngle);

                let startAngle = 0;

                for (let i = 0; i < data.categories.length; i++) {
                    const categoryTotal = data.categories[i].transactions.reduce((total, transaction) => {
                        return total + parseInt(transaction.amount.slice(1), 10);
                    }, 0);

                    const endAngle = startAngle + (Math.PI * 2 * categoryTotal) / totalAmount;

                    console.log(`Segment ${i}: Start Angle - ${startAngle}, End Angle - ${endAngle}`);

                    if (clickedAngle >= startAngle && clickedAngle < endAngle) {
                        onCategoryClick(data.categories[i].name);
                        break;
                    }

                    startAngle = endAngle;
                }
            }
        };



        // Add the event listener to the canvas
        canvas.addEventListener('click', handleCanvasClick);

        // Remove the event listener when the component is unmounted
        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, [data, onCategoryClick]);

    return <canvas ref={canvasRef} width="300" height="300"></canvas>;
};

export default DoughnutChart;

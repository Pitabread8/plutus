import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

const firebaseConfig = {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    projectId: process.env.DB_PROJECT_ID,
    storageBucket: process.env.DB_STORAGE_BUCKET,
    messagingSenderId: process.env.DB_SENDER_ID,
    appId: process.env.DB_APP_ID
};

initializeApp(firebaseConfig);
const db = getFirestore();

const date = new Date();
const month = (date.getMonth() + 1).toString().padStart(2, "0");

const convertDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
};

const getMonth = () => {
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ' ');
    return date.toLocaleString('default', { month: 'long' });
}


Chart.defaults.color = '#f5f5f5';

const Analytics = ({ user, openNew, openEdit, deleteStatus }) => {
    const [monthTotal, setMonthTotal] = useState(0);
    const [tipAverage, setTipAverage] = useState(0);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, "entries"), where("user", "==", user));
            const querySnapshot = await getDocs(q);

            let monthTotalCount = 0;
            let tipTotal = 0;
            let tipCount = 0;
            const paymentTypeCounts = {};

            querySnapshot.forEach((doc) => {
                const data = doc.data();

                if (convertDate(data.date).slice(0, 2) === month) {
                    monthTotalCount += data.total;
                }

                const tip = data.tip;
                if (tip > 0) {
                    if (data.selectedType === "percentage") {
                        tipTotal += (data.amount * tip) / 100;
                    } else {
                        tipTotal += data.tip;
                    }
                    tipCount++;
                }

                const paymentType = data.paymentType;
                if (paymentTypeCounts[paymentType]) {
                    paymentTypeCounts[paymentType]++;
                } else {
                    paymentTypeCounts[paymentType] = 1;
                }
            });

            setMonthTotal(monthTotalCount)
            setTipAverage(tipTotal / tipCount)

            setChartData({
                labels: Object.keys(paymentTypeCounts),
                datasets: [
                    {
                        label: "Payment Types",
                        data: Object.values(paymentTypeCounts),
                        backgroundColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102, 255)",
                            "rgba(255, 159, 64)",
                        ],
                    },
                ],
            });
        };

        fetchData();
    }, [openNew, openEdit, deleteStatus]);

    return (
        <div className="flex flex-row items-center justify-evenly gap-8 mt-12 bg-neutral-900 p-4 rounded-xl w-full max-w-[90%]">
            <h1 className="font-extrabold hidden md:inline text-8xl mx-36">Plutus</h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 md:justify-evenly md:flex-1 bg-neutral-800 px-8 py-2 md:p-4 rounded-lg">
                <div className="flex justify-center items-center w-48 md:w-auto">
                    {Object.keys(chartData).length > 0 && <Pie data={chartData} />}
                </div>
                <div className="flex flex-col items-center md:items-left justify-center gap-4 md:gap-12 self-stretch">
                    <div>
                        <h2 className="font-semibold text-center">{getMonth()} Spending</h2>
                        <p className="font-bold text-center text-2xl md:text-5xl">${monthTotal}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-center">Average Tip</h2>
                        <p className="font-bold text-center text-2xl md:text-5xl">${tipAverage.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
import React, { useState, useEffect } from "react";
import { Chart as chartjs } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import crosshair from "chartjs-plugin-crosshair";
import "./App.css";

chartjs.register(crosshair);

function App() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [totalRequests, setTotalRequests] = useState(0);
  const [departments, setDepartments] = useState("");

  useEffect(() => {
    fetch("https://checkinn.co/api/v1/int/requests")
      .then((response) => response.json())
      .then((data) => {
        if (data.requests) {
          var counts = {};
          var departmentsSet = new Set();
          data.requests.forEach((request) => {
            var hotelName = request.hotel.name;
            if (counts[hotelName]) {
              counts[hotelName]++;
            } else {
              counts[hotelName] = 1;
            }
            departmentsSet.add(request.desk.name);
          });
          var labels = Object.keys(counts);
          var dataPoints = Object.values(counts);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Requests",
                data: dataPoints,
                fill: false,
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                borderColor: "#378CE7",
                borderWidth: 6,
                pointRadius: 0,
                pointHoverRadius: 10,
                hoverBackgroundColor: "#378CE7",
                hoverBorderColor: "#378CE7",
              },
            ],
          });

          setTotalRequests(data.requests.length);
          setDepartments(Array.from(departmentsSet).join(", "));
        }
      });
  }, []);

  return (
    <div>
      <div style={{ maxWidth: "100%", height: "auto" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                display: true,
                text: "Requests Per Hotel",
                font: {
                  size: 20,
                },
              },
              legend: {
                display: false,
              },
              tooltip: {
                mode: "index",
                intersect: false,
                position: "nearest",
                backgroundColor: "#DDDDDD",
                titleColor: "#111111",
                bodyColor: "#111111",
                callbacks: {
                  labelColor: function (context) {
                    return {
                      borderColor: "#378CE7",
                      backgroundColor: "#378CE7",
                      borderWidth: 1,
                      borderDash: [0],
                      borderDashOffset: 0,
                    };
                  },
                  title: function (context) {
                    return context[0].label;
                  },
                  boxColor: function (context) {
                    return context.dataset.borderColor;
                  },
                },
                titleFont: {
                  size: 20,
                  weight: "bold",
                  color: "black", // Set text color to black
                },
                bodyFont: {
                  size: 15,
                  color: "black", // Set text color to black
                },
              },
              crosshair: {
                line: {
                  color: "#B4B4B8",
                  width: 1,
                  dashPattern: [5, 5],
                },
                sync: {
                  enabled: false,
                },
                zoom: {
                  enabled: false,
                },
                snap: {
                  enabled: false,
                },
              },
            },
            interaction: {
              mode: "nearest",
              axis: "x",
              intersect: false,
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  font: {
                    size: 12,
                  },
                  stepSize: 2,
                },
              },
            },
          }}
        />
      </div>
      <p style={{ textAlign: "center", fontSize: "20px" }}>
        Total requests: {totalRequests}
      </p>
      <p style={{ fontSize: "20px" }}>
        List of <em>unique</em> department names across all Hotels:{" "}
        {departments}
      </p>
    </div>
  );
}

export default App;

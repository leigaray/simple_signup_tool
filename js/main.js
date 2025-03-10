document.getElementById("loadData").addEventListener("click", function() {
    fetch("./mock-data.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => console.error("Error fetching mock data:", error));
});

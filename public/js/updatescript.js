const foodContainer = document.getElementById("food-container");

const fetchFood = async ()=>{
    try{
        const urlParams = new URLSearchParams(window.location.search);
        const response = await fetch("/food/" + urlParams.get("id"));
        if(!response.ok){
            throw new Error("Failed to get food");
        }

        //Parse
        const food = await response.json();

        return food;
    }catch(error)
    {
        console.error("Error: ", error);
        foodContainer.innerHTML = "<p style='color:red'>Failed to get food</p>"
    }
}

const updateFood = async ()=>{
    try{
        const foodDiv = document.createElement("div");

        const food = await fetchFood();
        if(!food){
            foodContainer.innerHTML = "<p style='color:red'>Failed to get food</p>";
            return;
        }

        foodContainer.innerHTML = "";
        foodDiv.className = "food";
        foodDiv.innerHTML = `<form action="/updatefood/" method="PUT"> 
        <label for="food">Food Name:</label><br>
        <input type="text" id="food" name="food">${food.food}</input><br>
        <label for="rank">Rank:</label><br>
        <input type="number" id="rank" name="rank">${food.rank}</input>
        <br>
        <button type="submit">Update</button></form>`
        foodContainer.appendChild(foodDiv);
    }catch(error){
        console.error("Error: ", error);
        foodContainer.innerHTML = "<p style='color:red'>Failed to get food</p>";
    }
}

updateFood();
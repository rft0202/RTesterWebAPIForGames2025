const foodContainer = document.getElementById("food-container");

const updateFood = async ()=>{
    try{
        const foodDiv = document.createElement("div");

        foodContainer.innerHTML = "";
        foodDiv.className = "food";
        foodDiv.innerHTML = `<form action="/updatefood/" method="PUT"> 
        <label for="food">Food Name:</label><br>
        <input type="text" id="food" name="food"><br>
        <label for="rank">Rank:</label><br>
        <input type="number" id="rank" name="rank">
        <br>
        <button type="submit">Update</button></form>`
        foodContainer.appendChild(foodDiv);
    }catch(error){
        console.error("Error: ", error);
        foodContainer.innerHTML = "<p style='color:red'>Failed to get food</p>";
    }
}

updateFood();
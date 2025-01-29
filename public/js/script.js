const foodContainer = document.getElementById("food-container");

//Grab foods
const fetchFoods = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/food"); //pass route
        if(!response.ok){
            throw new Error("Failed to get favorite foods");
        }

        //Parse JSON
        const foods = await response.json();

        //Format the data to HTML
        foodContainer.innerHTML = ""; //clear it

        foods.forEach((food) => {
            const foodDiv = document.createElement("div");
            foodDiv.className = "food";
            foodDiv.innerHTML = `${food.rank}. ${food.food}
            <form action="/updatefood/${food.food}" method="PUT"><button type="submit">Update</button></form>
            <form action="/deletefood/rank?rank=${food.rank}" method="DELETE"><button type="submit">Delete</button></form>`; //string literal (case sensitive)
            foodContainer.appendChild(foodDiv);
        });
    }catch(error){
        console.error("Error: ", error);
        userContainer.innerHTML = "<p style='color:red'>Failed to get favorite foods</p>";
    }
}

//Call function
fetchFoods();
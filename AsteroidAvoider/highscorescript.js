const fetchHighScores = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/highscores"); //pass route
        if(!response.ok){
            throw new Error("Failed to get highscores");
        }

        //Parse JSON
        const highscores = await response.json();

        var list;

        highscores.forEach((score) => {

            list = `${score.name}   ${score.highscore}`;
        });

        return list;
    }catch(error){
        console.error("Error: ", error);
    }
}
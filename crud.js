/*
Create a CRD application (CRUD without update) using json-server or another API
Use fetch and async/await to interact with the API
Use a form to create/post new entities
Build a way for users to delete entities
Include a way to get entities from the API and display them
You do NOT need update, but you can add it if you'd like
Use Bootstrap and/or CSS to style your project

*/

var tbody;
var genretbody;
var reviewtbody;

// This event listener function sets up the logic for the tables of data.
// It styles the tables, creates the headings, then retrieves the data from
// json server to populate the table. This is repeated for the movie, genre,
// and reviews tables.
document.getElementById("fetch-movies").addEventListener("click", () => {

    //Clears any previous data from the container, so data is always fresh
    clearBox("movies-container");
    var  moviesContainer = document.getElementById("movies-container");
    // Specifies the container grid for the table
    moviesContainer.className = "container col-sm-4"
    var  tableHeader = document.createElement('thead');
    var myTable = document.createElement('table');
    //The bootstrap style attributes for the table
    myTable.className = "table table-primary table-bordered table-striped";
    tableHeader.innerHTML = `<tr>
                                <th>ID</th>
                                <th>Movie</th>
                                <th>GenreID</th>
                                </tr> `;


    myTable.appendChild(tableHeader);
    tbody = document.createElement('tbody');
    myTable.appendChild(tbody);
    moviesContainer.appendChild(myTable);
    //Fetches data to populate the table
    onFetchMoviesClick();

    clearBox("genres-container");
    var  genresContainer = document.getElementById("genres-container");
    genresContainer.className = "container col-sm-4"
    var genretableHeader = document.createElement('thead');
    var genremyTable = document.createElement('table');
    genremyTable.className = "table table-primary table-bordered table-striped";
    genretableHeader.innerHTML = `<tr>
                                <th>Genre</th>
                                <th>GenreID</th>
                                </tr> `;


    genremyTable.appendChild(genretableHeader);
    genretbody = document.createElement('tbody');
    genremyTable.appendChild(genretbody);
    genresContainer.appendChild(genremyTable);
    onFetchGenresClick();

    clearBox("reviews-container");
    var reviewsContainer = document.getElementById("reviews-container");
    var reviewtableHeader = document.createElement('thead');
    var reviewmyTable = document.createElement('table');
    reviewmyTable.className = "table table-primary table-bordered table-striped";
    reviewtableHeader.innerHTML = `<tr>
                                <th>ID</th>
                                <th>MovieID</th>
                                <th>Content</th>
                                </tr> `;


    reviewmyTable.appendChild(reviewtableHeader);
    reviewtbody = document.createElement('tbody');
    reviewmyTable.appendChild(reviewtbody);
    reviewsContainer.appendChild(reviewmyTable);
    onFetchReviewsClick();

});

// The async function to retrieve results from the server
async function onFetchMoviesClick() {
    const response = await fetch("http://localhost:3000/movies")
    const movieList = await response.json()
    // Maps the results received to the table elements
    tbody.innerHTML= movieList.map(
        movie => `<tr>
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.genreId}</td>
                </tr>
        `
    ).join("")
 
   
}

// Function to clear data given any id
function clearBox(elementID) { 
    var div = document.getElementById(elementID); 
     
    while(div.firstChild) { 
        div.removeChild(div.firstChild); 
    } 
} 

// Function that checks if a value is a string
function isString(value) {
    return typeof value === 'string';
}

// Function that checks if a value is a number
function isNumber(value) {
    return typeof value === 'number';
}

// Function to pull the new information from the form to create a new movie object 
// on the backend server.
function getNewMovieData() {
    document.getElementById("create-movie").addEventListener("click", () => {
    // Retrive the values from the form elements
    let newMovieTitle = document.getElementById("movie-title").value;
    let newMovieGenreId = document.getElementById("movie-genre-id").value;
    let intGenreId = parseInt(newMovieGenreId);
   
    // Form data validation
    if(  newMovieGenreId === "" || newMovieTitle === "")
        return;
    if(isNumber(intGenreId) && isString(newMovieTitle) ) {
            // Function to run the post request to the server
            onCreateMovieClick(newMovieTitle, intGenreId);
       
    }
    });
}

//Call to the previously created function to process the event click to create
let lastCreatedItem = null
getNewMovieData();

// The async function to process the post method with header to retrieve the result body
async function onCreateMovieClick(newMovieTitle, intGenreId) {
    
        const testMovie = {};
        testMovie.title = newMovieTitle;
        testMovie.genreId = intGenreId;

        
        const response = await fetch("http://localhost:3000/movies", {
            method: "POST", // create
            headers: { "Content-Type": "application/json" }, // I recommend copy-pasting this
            body: JSON.stringify(testMovie) // Turns JS data into JSON data
        })
        // We need to parse out the newly created item from the response body
        // because that newly created item will have the id given to it by the backend
        const newlyCreatedItem = await response.json()
        lastCreatedItem = newlyCreatedItem
        
    }
// Function to get row id data from the form to pass to the server for deletion
function getDeleteMovieId() {
    document.getElementById("delete-movie").addEventListener("click", () => {
     
        // retrieves data from form text box
        let deleteItemId = document.getElementById("dbmovie-id").value;
        let intId = parseInt(deleteItemId);
       
        // clears the form text box
        const foobar = document.getElementById("dbmovie-id");
        foobar.value = '';
        
        // Validates the id as a number
        if(isNumber(intId) ) {
                //Calls the function to delete the row with id
                onDeleteMovieClick(intId);
                
           
        }
        
        });
        
}

//Call to the previously written function
getDeleteMovieId();


//The async function to send Delete request to the server, it is passed the id value
async function onDeleteMovieClick(intId) {
    // This is just a little error checking for our demo
    if(intId=== null) {
        console.log("No item created yet to delete")
        return
    }
    // In this app we don't need the response and we don't need to wait
    // for the request to finish, but in a different app we might
    // Make sure the URL has the id of the item to delete on the end
    fetch("http://localhost:3000/movies/" + intId, {
        method: "DELETE", // delete
    })
    document.getElementById("fetch-movies").click();
}

/***** GENRES *****/



// Function to send request to retrieve all the genre db data
async function onFetchGenresClick() {
    const response = await fetch("http://localhost:3000/genres")
    const genreList = await response.json()

    //Places the data in the table
    genretbody.innerHTML = genreList.map(
        genre => `<tr>
            <td>${genre.name}</td>
            <td>${genre.id}</td>
                </tr>
        `
    ).join("")
}

// Function to process the create click and retreive data from the form
// then create the new genre name
function getNewGenreData() {
    document.getElementById("create-genre").addEventListener("click", () => {
    // Gets the value from the form
    let newGenreName = document.getElementById("genre-name").value;
   
   // validate the information from the textbox is a string
    if(   newGenreName === "")
        return;
    if(isString(newGenreName) ) {
            // Call the function to create the data passing the name as parameter
            onCreateGenreClick(newGenreName);
       
    }
    });
}

// Async function to process post to the server and send body 
async function onCreateGenreClick(newGenreName) {
    
    
    // TODO: Create the new genre on the backend
    const newGenre = {};
        newGenre.name = newGenreName;
        

        
        const response = await fetch("http://localhost:3000/genres", {
            method: "POST", // create
            headers: { "Content-Type": "application/json" }, // I recommend copy-pasting this
            body: JSON.stringify(newGenre) // Turns JS data into JSON data
        })
        // We need to parse out the newly created item from the response body
        // because that newly created item will have the id given to it by the backend
        const newlyCreatedItem = await response.json()
        lastCreatedItem = newlyCreatedItem
}

// Call to create the new genre
getNewGenreData();


// Function for deleting the genre given the id from the form
function getDeleteGenreId() {
    document.getElementById("delete-genre").addEventListener("click", () => {
        
        
        let deleteItemId = document.getElementById("dbgenre-id").value;
        let intId = parseInt(deleteItemId);
       
        //Clear the form after getting the data
        const foobar = document.getElementById("dbgenre-id");
        foobar.value = '';
        // Validate the id information
        if(isNumber(intId) ) {
                // Call to process the delete action
                onDeleteGenreClick(intId);
           
        }
        
        });
        
}

// Async delete function using the id passed parameter
async function onDeleteGenreClick(intId) {
    
    
    // TODO: Delete the genre with the idToDelete
    // This is just a little error checking for our demo
    if(intId=== null) {
        console.log("No item created yet to delete")
        return
    }
    // In this app we don't need the response and we don't need to wait
    // for the request to finish, but in a different app we might
    // Make sure the URL has the id of the item to delete on the end
    fetch("http://localhost:3000/genres/" + intId, {
        method: "DELETE", // delete
    })
    
}
getDeleteGenreId();

/*************REVIEWS******** */

//Async function to get reviews from the server and place in the table body
async function onFetchReviewsClick() {
    const response = await fetch("http://localhost:3000/reviews")
    const reviewList = await response.json()

    reviewtbody.innerHTML= reviewList.map(
        review => `<tr>
            <td>${review.id}</td>
            <td>${review.movieId}</td>
            <td>${review.content}</td>
                </tr>
        `
    ).join("")
 
   
}

// Function to get data from the form and validate for passing parameter to 
// create a new review
function getNewReviewData() {
    document.getElementById("create-review").addEventListener("click", () => {
    
    let newReviewContent = document.getElementById("review-content").value;
    let newMovieId = document.getElementById("review-movie-id").value;
    let intMovieId = parseInt(newMovieId);
   
    if(  newMovieId === "" || newReviewContent === "")
        return;
    if(isNumber(intMovieId) && isString(newReviewContent) ) {
            //Call to function to create on the server
            onCreateReviewClick(newReviewContent, intMovieId);
       
    }
    });
}

// Call to the previous function
getNewReviewData();

// Async function to process post request with header and body
async function onCreateReviewClick(newReviewContent, intMovieId) {
    
        const testReview = {};
        testReview.movieId = intMovieId;
        testReview.content = newReviewContent;

        
        const response = await fetch("http://localhost:3000/reviews", {
            method: "POST", // create
            headers: { "Content-Type": "application/json" }, // I recommend copy-pasting this
            body: JSON.stringify(testReview) // Turns JS data into JSON data
        })
        // We need to parse out the newly created item from the response body
        // because that newly created item will have the id given to it by the backend
        const newlyCreatedItem = await response.json()
        lastCreatedItem = newlyCreatedItem

    }

// Function to get the review id from the form and send to function for deletion    
function getDeleteReviewId() {
    document.getElementById("delete-review").addEventListener("click", () => {
        
        // Get the id from the form
        let deleteItemId = document.getElementById("dbreview-id").value;
        let intId = parseInt(deleteItemId);
       
        // Clear the form field text box
        const foobar = document.getElementById("dbreview-id");
        foobar.value = '';

        if(isNumber(intId) ) {
                //Call the function to process the delete
                onDeleteReviewClick(intId);
           
        }
        
        });
        
}

//Call to previous function
getDeleteReviewId();


// Async function to process the delete, passed an id parameter
async function onDeleteReviewClick(intId) {
    // This is just a little error checking for our demo
    if(intId=== null) {
        console.log("No item created yet to delete")
        return
    }
    // In this app we don't need the response and we don't need to wait
    // for the request to finish, but in a different app we might
    // Make sure the URL has the id of the item to delete on the end
    fetch("http://localhost:3000/reviews/" + intId, {
        method: "DELETE", // delete
    })
}

// Call to process a click on the fetch button to refresh the data
document.getElementById("fetch-movies").click();
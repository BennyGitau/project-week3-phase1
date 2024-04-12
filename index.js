let addRide = false;
let addComment = true;


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#ride-btn");
  const addRideContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addRide = !addRide;
    if (addRide) {
      addRideContainer.style.display = "block";
    } else {
      addRideContainer.style.display = "none";
    }
  });

  //function to fetch a rides
   const fetchRides = async ()=>{
    const res = await fetch("http://localhost:3000/rides")
    const rides = await res.json()
    return rides;   
     }
     fetchRides()

  //fetch comments 
  const fetchComments = async (id)=> {
    const res = await fetch(`http://localhost:3000/rides/${id}`)
    const data = await res.json()
    const comments = data.comments
    return comments;
  }    
  //function to display ride---card rides

  const handleRide = async ()=>{
    const rides =await fetchRides()
    rides.forEach(ride => {
    const card = document.createElement('div')
    card.className = 'card';
    card.innerHTML = `
      
        <h3 id="ride-title" class="rideTitle">${ride.title}</h3>

        <div class="car-image">
            <img class="ride-image"src="${ride.image}" alt="${ride.title}">
        </div>
        <div class="more-info">
            <div><button id="${ride.id}" class="rate-btn">rate</button><p id="rate-content" class="content">${ride.ratings}</p></div>
            <div><p id="like-content" class="content">${ride.likes}</p><button id="${ride.id}" class="like-btn">❤️</button></div>
        </div>
        <div class="description-section">
          <div>
            <button id="description-btn">View Description</button>
            <div id="description"></div>
          </div>
        </div>
        <ul id="comment-list" class="comments"> 
        </ul>
    `
    document.getElementById('ride-collection').appendChild(card)
    const commentForm = document.createElement('form')
    commentForm.className = "comment-form"
    commentForm.innerHTML = `
        <input type="text" name="text" placeholder="Enter a comment...." class="input-text" value="">
        <button id="comment-btn" type="submit">Post</button>
    `
    card.appendChild(commentForm)
    //viewdescription
    const descriptionbtn = card.querySelector('#description-btn');
    
    const description = card.querySelector('#description')
    
    let d = false
    descriptionbtn.addEventListener('mouseover', () =>{
      d = !d
      if(d){
        description.textContent = ride.description;
        //description.style.display = "block"
      } else {
        description.textContent = ""
        //description.style.display ="none"
      }
    });
//search functionality
  const search =()=>{
  const searchInput = document.getElementById('search-form').value.toUpperCase();
  const searchProduct = document.getElementById("ride-collection")
  console.log(searchProduct);
  console.log(card)
  const products = document.querySelectorAll('.card')
  console.log(products)
  const productName = searchProduct.querySelectorAll(".rideTitle")

  for(let i=0; i<productName.length; i++){
    let match = products[i].getElementsByTagName("h3")[0];
    if(match){
      let textValue = match.textContent || match.innerHTML
      if(textValue.toUpperCase().indexOf(searchInput) > -1){
        products[i].style.display ="";
       } else {
        products[i].style.display ="none";

    }
  }
 }
}
search()

  //adding a comment
    card.querySelector(".comment-form").addEventListener('submit',(e)=>{
      e.preventDefault();
      let newComment = {
        comments: e.target.text.value,
        }
      displayComments(newComment)
      updateComment(newComment)
  
    })
    

    //function to display comments
    const displayComments = async ()=> {
      const comments = await fetchComments(ride.id)
      const commentList = card.querySelector("#comment-list")
      comments.forEach(comment => {
          const list = document.createElement('li')
          list.textContent = comment

          commentList.appendChild(list)
          list.addEventListener('click',() =>{
            list.remove()
            deleteComment(comment)
            
            //updateComment(comment)
        })
        })
    }
    displayComments()
    //increment likes
    function incrementLikes (){
      const like = card.querySelector('#like-content')
      const likeBtn = card.querySelector('.like-btn')
      likeBtn.addEventListener("click", ()=>{
        like.innerText = ++ride.likes
        updateRide(ride)
      })

    }
    incrementLikes()
//increment ratings
    function incrementRatings (){
      const ratings = card.querySelector("#rate-content")
      card.querySelector('.rate-btn').addEventListener('click', ()=>{
        if(ratings.innerText < 5) {
          ratings.innerText = ride.ratings;
          ride.ratings+=0.5
        }
        updateRide(ride)
      })
    }
    incrementRatings()  
  }) 
}
handleRide()
 //function to handle submit ride

    document.querySelector('.add-ride-form').addEventListener('submit',(e) => {
      e.preventDefault()
      let newRide = {
        title: e.target.title.value,
        description: e.target.description.value,
        image: e.target.image.value,
        likes: 0,
        ratings: 0,
        comments: []
      }
      handleRide(newRide);
      addRide(newRide)
      //function to post to backend new ride
      function addRide (ride){
        fetch("http://localhost:3000/rides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(ride),
        })
        .then(res => res.json())
      }
    })

//update likes
function updateRide (ride){
  fetch(`http://localhost:3000/rides/${ride.id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(ride)
  })
  .then(response => response.json())
}
//function to update new comment
function updateComment (ride){
  fetch(`http://localhost:3000/rides/${ride.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(ride)
  })
  .then(res => res.json())
  .then(data => console.log(data))
}


function deleteComment(comment){
  fetch(`http://localhost:3000/rides/${comment.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
    })
    .then(res => res.json())
    .then(data => console.log(data))
}

    
const radioButtons = document.querySelectorAll('input[name="color-mode"]');
const element = document.querySelector('body');

radioButtons.forEach(radioButton => {
  radioButton.addEventListener('change', function() {
    element.setAttribute('color-mode', this.value);
  });
});
/*//search functionality
const searchButton = document.getElementById('search-btn');
searchButton.addEventListener("click", search)
const search = ()=> {
const searchInput = document.getElementById('search-form').value.toUpperCase();
const searchProduct = document.getElementById("ride-collection")
const products =card.querySelectorAll('.card')
const productName = searchProduct.querySelectorAll(".rideTitle")

for(let i=0; i<productName.length; i++){
  let match = product[i].querySelectorAll("rideTitle")[0];
  if(match){
    let textValue = match.textContent || match.innerHTML
    if(textValue.toUpperCase().indexOf(searchInput) > -1){
      product[i].style.display ="";
    } else {
      product[i].style.display ="none";

    }
  }
  
})
    const searchTerm = searchInput.value;

}
}
// add event listener to the button
searchButton.addEventListener('click', function() {
  // get the search input value
  // do something with the search term (e.g. redirect to a search results page)
  console.log(Searching for "${searchTerm}"...);
});

// add event listener to the input (if you want to trigger the search on Enter keypress)
searchInput.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    // simulate a button click to trigger the search
    searchButton.click();
  }
});*/



});



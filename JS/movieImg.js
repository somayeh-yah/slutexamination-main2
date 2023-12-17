
const moviesImg = document.querySelector("#movieImgContainer");

const movieItems = [
  {
    img: "img/img-1-godfather.jpeg",
  },
  {
    img: "/img/img-2-Napoleon.jpg",
  },
  {
    img: "/img/img-3-Furiosa.jpeg",
  },
  {
    img: "/img/img-4-Redemption.jpg",
  },
  {
    img: "/img/img-5-Prestige.jpg",
  },
  {
    img:"/img/img-6-GrownUps.jpg",
  },
  {
    img: "/img/img-7-Archies.jpg",
  },
  {
    img: "/img/img-8-Barbie.jpg",
  },
];

function genarateImages() {
  return (moviesImg.innerHTML = movieItems
    .map((movieObject)=>{
        
    return `
    <div>
    <img width="200" src= ${movieObject.img} alt="">
    </div>
    
    `
  }).join(""));
}
genarateImages();

// export{genarateImages}
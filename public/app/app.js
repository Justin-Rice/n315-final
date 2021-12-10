var loggedIn = false;
var cart = []
var cartLength = 0;
var toastMixin = Swal.mixin({
  toast: true,
  icon: 'success',
  background: "#fff" ,
  title: 'General Title',
  
  position: 'top-start',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

function initFirebase(){
    firebase
    .auth()
    .onAuthStateChanged(function(user){
        if(user){

            loggedIn = true;
        

            console.log("user detected");
        }else{
            loggedIn = false;
            console.log("user not there");
        }
    })

}
function route(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/","");
    //pageID holds page name

    if(!pageID){
        MODEL.changePage("home", MODEL.loadMakers);   
        
           
    }else if(pageID == "home"){
        MODEL.changePage("home", MODEL.loadMakers);   

    }else{
        MODEL.changePage(pageID);
    }
}
function createUser(){
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let password = $("#pw").val();

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#pw").val("");
    var user = userCredential.user;
    Swal.fire({
        background: "#fff",
        title: "Account Created",
        text: 'you have been logged in.',
        confirmButtonColor: '#A7E8BD'

      }).then((result)=>{
        location.reload();

      })

    //console.log("account created")
    
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    Swal.fire({
        background: "#fff",
        title: "Error",
        text: 'There has been an unexpected error in account creation',
        confirmButtonColor: '#F25C54'

      })
  });


}
function logInUser(){
    let email = $("#email-li").val();
    let password = $("#pw-li").val();
    
   // console.log("login");
    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    $("#email-li").val("");
    $("#pw-li").val("");
    var user = userCredential.user;
    Swal.fire({
        icon: 'success',
        text: "You have successfully logged in.",
        background: "#fff" ,
        confirmButtonColor: '#A7E8BD'
      }).then((result)=>{
        location.reload();

      })
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    Swal.fire({
        background: "#fff",
        title: "Error",
        text: 'There has been an unexpected error in Login.',
        confirmButtonColor: '#F25C54'

      })
  });

}
function addToCart(index){
  var newItem ={
    "makerImage": "",
    "makerName": "",
    "makerPrice": "",
    
    
  };
    $.getJSON("data/data.json", function(makers){
      if(loggedIn == true){
        newItem.makerName = makers._MAKERS[index].makerName;
        newItem.makerImage =  makers._MAKERS[index].makerimage;
        newItem.makerPrice = makers._MAKERS[index].makerPrice;

        if(cartLength == 0){
          cart.push(newItem)
          cartLength = cart.length;
          $(".fa-shopping-cart").append(`
          <span id="cart">${cartLength}</span>
          `)
          toastMixin.fire({
            title: 'item added to cart',
          });

        }else{
         cart.push(newItem)
         cartLength = cart.length;
         $(".fa-shopping-cart").html(`
         <span id="cart">${cartLength}</span>
         `)
         toastMixin.fire({
          title: 'item added to cart',
        });
        }

      }else{
        Swal.fire({
          text: "You must be logged in to add items to your cart.",
          icon: 'warning',
          background: "#fff" ,
          confirmButtonColor: '#A7E8BD',
          confirmButtonText: 'Ok',
          customClass: {
              container: 'popup-back',
              popup: 'popup',
              header: 'head',
  
          }
  
        })
        

      }

    console.log(makers._MAKERS[index].makerPrice);
});

}
function initlisteners(){
    $(window).on("hashchange", route);
if(!loggedIn == true){
    $(".fa-user").click(function(){
        console.log('thing')
        $(".login-form").css("display", "inline-block");
    });

    $("body").on("click", ".close", function(e) {
        $(".login-form").css("display", "none");

        setTimeout(() => {
            $(".mobile-nav").css("display", "none");
        }, 1000);
        
    });
}else{
    $(".fa-user").click(function(){
        Swal.fire({
            text: "Are you sure you want to log out?",
            icon: 'warning',
            background: "#fff" ,
            showCancelButton: true,
            confirmButtonColor: '#A7E8BD',
            cancelButtonColor: '#F25C54',
            confirmButtonText: 'Yes, logout',
            customClass: {
                container: 'popup-back',
                popup: 'popup',
                header: 'head',
    
            }
    
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                background: "#fff",
                text: 'You have been logged out.',
                confirmButtonColor: '#A7E8BD'
    
              }).then((result)=>{
                location.reload();

              })
              firebase.auth().signOut().then(() => {
                // Sign-out successful.
                console.log(loggedIn)
              }).catch((error) => {
                // An error happened.
              });
             
    
            }
          })
       
    });

}
    
    route();
}


$(document).ready(function(){
    try{
        initFirebase();
        
        setTimeout(() => {initlisteners(); }, 500);

        //route();
       // initlistener();
       // underlineActivePage();
      //  browseRecipes();

        
        let app = firebase.app();
    }catch{
        console.log("gwa");
    }
    
})
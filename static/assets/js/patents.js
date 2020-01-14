async function navbarControl(){
  const response = await fetch( "api/auth/isLogged" );
  const isLogged = ( await response.json() ).data;

  const authLink = document.querySelector( "#authLink" );
  const uploadLi = document.querySelector( "#uploadLi" );

  if( isLogged ){
    authLink.href = "/logout";
    authLink.innerHTML = "SIGN OUT";

    uploadLi.classList.toggle( "hidden" );
  }
}

async function index(){
  navbarControl();

  const searchInput = document.querySelector( "#searchInput" );
  const searchContainer = document.querySelector( "#searchContainer" );
  const magnifier = document.querySelector( "#magnifier" );

  searchInput.addEventListener( "focus", () => {
    searchContainer.style.backgroundColor = "rgba( 255, 255, 255, 0.28 )";
    magnifier.src = "assets/img/magnifier-selected.png";
  } );
  searchInput.addEventListener( "blur", () => {
    searchContainer.style.backgroundColor = "rgba( 255, 255, 255, 0.5 )";
    magnifier.src = "assets/img/magnifier-unselected.png";
  } );
}

window.addEventListener( "load", index );

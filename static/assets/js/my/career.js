async function navbarControl(){
  const response = await fetch( "api/auth/isLogged" );
  isLogged = ( await response.json() ).data;

  if( isLogged ){
    authLink.href = "/logout";
    authLink.innerHTML = "ВЫЙТИ";
  }
}

function index(){
  navbarControl();
}

window.addEventListener( "load", index );

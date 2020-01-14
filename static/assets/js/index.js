function patentIssue( patent ){
  const image = document.querySelector( "#patentDetailImage" );

  image.style.backgroundImage = `url( "assets/img/patents/${patent.serial_number}.jpg" )`;
  image.style.backgroundRepeat = "no-repeat";
  image.style.backgroundSize = "contain";
  image.style.backgroundPosition = "center center";

  document.querySelector( "#patentDetailSerialNumber" ).innerHTML = `№ ${patent.serial_number}`;
  document.querySelector( "#patentDetailName" ).innerHTML = patent.name;
  document.querySelector( "#patentDetailDescription" ).innerHTML = patent.description;
  document.querySelector( "#overlay" ).classList.remove( "hidden" );
  document.body.style.overflow = "hidden";
}

// #fix
async function fetchPatents(){
  const response = await fetch( "api/patents/get?count=3" );
  const patents = ( await response.json() ).data;

  for( let i = 0; i < patents.length; i++ ){
    document.getElementsByName( "patentSerialNumber" )[i].innerHTML = `№ ${patents[i].serial_number}`;
    document.getElementsByName( "patentName" )[i].innerHTML = patents[i].name;

    image = document.getElementsByName( "patentImage" )[i];
    image.style.backgroundImage = `url( "assets/img/patents/${patents[i].serial_number}.jpg" )`;
    image.style.backgroundRepeat = "no-repeat";
    image.style.backgroundSize = "cover";
    image.style.backgroundPosition = "center center";

    document
      .getElementsByName( "patentSection" )[i]
      .addEventListener( "click", () => patentIssue( patents[i] ) );
  }
}

// #fix
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
  fetchPatents();
  navbarControl();

  document
    .querySelector( "#overlayClose" )
    .addEventListener( "click", () => {
      document.querySelector( "#overlay" ).classList.add( "hidden" );
      document.body.style.overflow = "auto";
    } );
}

window.addEventListener( "load", index );

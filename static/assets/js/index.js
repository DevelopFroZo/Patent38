let overlayOpened = false;

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
  overlayOpened = true;
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

function overlayClose(){
  document.querySelector( "#overlay" ).classList.add( "hidden" );
  document.body.style.overflow = "auto";
  overlayOpened = false;
}

// #fix пустые поля
async function patentBuyHandler(){
  const response = await fetch( "api/patents/buy/123456", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( {
      email: "some@email.example",
      phone: "89999999999"
    } )
  } );
  const jsn = await response.json();

  console.log( jsn );
}

function index(){
  fetchPatents();
  navbarControl();

  document
    .querySelector( "#overlayClose" )
    .addEventListener( "click", overlayClose );
  document.body.addEventListener( "keydown", ( e ) => overlayOpened && e.key === "Escape" ? overlayClose() : null );
  document.querySelector( "#patentBuy" ).addEventListener( "click", patentBuyHandler );
}

window.addEventListener( "load", index );

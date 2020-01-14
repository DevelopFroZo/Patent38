async function fetchPatents(){
  const response = await fetch( "api/patents/get" );
  const patentsData = ( await response.json() ).data;
  const patents = document.querySelector( "#patents" );
  let div, element;

  for( let i = 0; i < patentsData.length; i++ ){
    div = document.createElement( "div" );
    div.className = "col-xs-12 col-sm-6 col-md-6 col-lg-4";
    div.innerHTML = `
      <div name = "patentSection" class = "patent-section">
        <div class = "patent">
          <div name = "patentSerialNumber" class = "patent-serialnumber">${patentsData[i].serial_number}</div>
          <div name = "patentName" class = "patent-name">${patentsData[i].name}</div>
          <div name = "patentImage" class = "patent-image" style = "
            background: url( 'assets/img/patents/${patentsData[i].serial_number}.jpg' );
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center center;
          "></div>
        </div>
        <div class = "text-center">
          <button class = "patent-issue">ОФОРМИТЬ ЗАЯВКУ</button>
        </div>
      </div>
    `;
    patents.appendChild( div );
  }
}

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

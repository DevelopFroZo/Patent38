let patentsCount = 0;

function addPatentsToDOM( patentsData, patentIssueForm ){
  const patents = document.querySelector( "#patents" );
  let div, element;

  for( let i = 0; i < patentsData.length; i++ ){
    div = document.createElement( "div" );
    div.className = "col-xs-12 col-sm-6 col-md-6 col-lg-4";
    div.innerHTML = `
      <div name = "patentSection" class = "patent-section">
        <div class = "patent">
          <div name = "patentSerialNumber" class = "patent-serialnumber"></div>
          <div name = "patentName" class = "patent-name"></div>
          <div name = "patentImage" class = "patent-image"></div>
        </div>
        <div class = "text-center">
          <button class = "patent-issue">ОФОРМИТЬ ЗАЯВКУ</button>
        </div>
      </div>
    `;
    patents.appendChild( div );

    fillPatent( patentsData, patentsCount, patentIssueForm );
    patentsCount++;
  }
}

// #fix грузить по частям
async function fetchPatents( patentIssueForm ){
  const response = await fetch( "api/patents/get" );
  const patentsData = ( await response.json() ).data;

  addPatentsToDOM( patentsData, patentIssueForm );
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

async function searchPatents( patentIssueForm ){
  let search = document.querySelector( "#searchInput" ).value;

  document.querySelector( "#patents" ).innerHTML = "";
  patentsCount = 0;
  search = search.replace( /  +/g, " " ).replace( / /g, "|" );

  const response = await fetch( `api/patents/get?search=${search}` );
  const patentsData = ( await response.json() ).data;

  addPatentsToDOM( patentsData, patentIssueForm );
}

async function index(){
  const overlay = new Overlay( document.querySelector( "#overlay" ), document.querySelector( "#overlayClose" ) );
  const patentIssueForm = new PatentIssueForm( overlay );
  const searchInput = document.querySelector( "#searchInput" );
  const searchContainer = document.querySelector( "#searchContainer" );
  const magnifier = document.querySelector( "#magnifier" );

  fetchPatents( patentIssueForm );
  navbarControl();

  searchInput.addEventListener( "focus", () => {
    searchContainer.style.backgroundColor = "rgba( 255, 255, 255, 0.28 )";
    magnifier.src = "assets/img/magnifier-selected.png";
  } );

  searchInput.addEventListener( "blur", () => {
    searchContainer.style.backgroundColor = "rgba( 255, 255, 255, 0.5 )";
    magnifier.src = "assets/img/magnifier-unselected.png";
  } );

  searchInput.addEventListener( "keydown", ( e ) => {
    if( e.key === "Enter" ) searchPatents( patentIssueForm );
    else if( e.key === "Escape" ){
      searchInput.value = "";
      searchPatents( patentIssueForm );
    }
  } );

  magnifier.addEventListener( "click", searchPatents );
  document.body.addEventListener( "keydown", ( e ) => overlay.closeByEscape( e ) );
}

window.addEventListener( "load", index );

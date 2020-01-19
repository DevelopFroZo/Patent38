let isLogged = false;
let patentsCount = 0;

async function deletePatent( column, serialNumber ){
  const isConfirmed = confirm( `Вы точно хотите удалить патент №${serialNumber}?` );

  if( !isConfirmed ) return;

  const response = await fetch( "/api/patents/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( {
      serialNumbers: [ serialNumber ]
    } )
  } );
  const jsn = await response.json();

  if( !jsn.ok )
    return alert( "Ошибка. Невозможно удалить патент" );

  document.querySelector( "#patents" ).removeChild( column );
}

function addPatentsToDOM( patentsData, patentIssueForm ){
  const patents = document.querySelector( "#patents" );

  for( let i = 0; i < patentsData.length; i++ ){
    let toolbar = document.createElement( "div" );
    toolbar.classList.add( "toolbar" );
    toolbar.classList.add( "toolbar-hidden" );

    let div = document.createElement( "div" );
    let img = document.createElement( "img" );
    img.setAttribute( "src", "assets/img/pencil.png" );
    div.appendChild( img );
    div.addEventListener( "click", () => {} );
    toolbar.appendChild( div );

    let divCross = document.createElement( "div" );
    img = document.createElement( "img" );
    img.setAttribute( "src", "assets/img/cross1.png" );
    divCross.appendChild( img );
    toolbar.appendChild( divCross );

    let patentSection = document.createElement( "div" );
    patentSection.setAttribute( "name", "patentSection" );
    patentSection.className = "patent-section";
    patentSection.innerHTML = `
      <div class = "patent">
        <div name = "patentSerialNumber" class = "patent-serialnumber"></div>
        <div name = "patentName" class = "patent-name"></div>
        <div name = "patentImage" class = "patent-image"></div>
      </div>
      <div class = "text-center">
        <button class = "patent-issue">ОФОРМИТЬ ЗАЯВКУ</button>
      </div>
    `;

    div = document.createElement( "div" );
    divCross.addEventListener( "click", () => {
      deletePatent( div, patentsData[i].serial_number );
    } );
    div.className = "col-xs-12 col-sm-6 col-md-6 col-lg-4";
    div.appendChild( toolbar );
    div.appendChild( patentSection );

    if( isLogged ){
      div.addEventListener( "mouseover", () => {
        toolbar.classList.remove( "toolbar-hidden" )
      } );
      div.addEventListener( "mouseout", () => {
        toolbar.classList.add( "toolbar-hidden" )
      } );
    }

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
  isLogged = ( await response.json() ).data;

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

  await navbarControl();
  fetchPatents( patentIssueForm );

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

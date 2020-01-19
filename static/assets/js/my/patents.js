let isLogged = false;
let patentsCount = 0;
let currentPatent, currentPatentIndex;

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

function openEditForm( overlay ){
  const imageSelected = document.querySelector( "#imageSelected" );

  document.querySelector( "#imageUnselected" ).classList.add( "hidden" );
  imageSelected.classList.remove( "hidden" );
  document.querySelector( "#patentDetail" ).classList.add( "hidden" );
  document.querySelector( "#patentEdit" ).classList.remove( "hidden" );

  imageSelected.style.backgroundImage = `url( assets/img/patents/${currentPatent.serial_number}.jpg )`;
  imageSelected.style.backgroundRepeat = "no-repeat";
  imageSelected.style.backgroundSize = "contain";
  imageSelected.style.backgroundPosition = "center center";

  document.querySelector( "#serialNumberInput" ).value = currentPatent.serial_number;
  document.querySelector( "#nameInput" ).value = currentPatent.name;
  document.querySelector( "#descriptionInput" ).value = currentPatent.description;

  overlay.open();
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
    div.addEventListener( "click", () => {
      currentPatent = patentsData[i];
      currentPatentIndex = i;
      openEditForm( patentIssueForm.overlay );
    } );
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

    document
      .getElementsByName( "patentSection" )[i]
      .addEventListener( "click", () => {
        document.querySelector( "#patentDetail" ).classList.remove( "hidden" );
        document.querySelector( "#patentEdit" ).classList.add( "hidden" );
      } );
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

async function editPatent( overlay ){
  const name = document.querySelector( "#nameInput" );
  const image = document.querySelector( "#imageInput" );
  const description = document.querySelector( "#descriptionInput" );
  const formData = new FormData();
  let error;

  // #fix пустые значения

  formData.append( "serialNumber", parseInt( currentPatent.serial_number ) );
  formData.append( "name", name.value );
  formData.append( "image", image.files[0] );
  formData.append( "description", description.value );

  const response = await fetch( `api/patents/put/${currentPatent.serial_number}`, {
    method: "PUT",
    body: formData
  } );
  const jsn = await response.json();

  if( !jsn.ok ){
    switch( jsn.code ){
      case 1: error = "Проблема с базой данных"; break;
      case 5: error = "Неверный номер патента"; break;
      case 7: error = "Проблема с добавлением изображения"; break;
    }

    alert( `Ошибка. ${error}` );
  }
  else {
    document.getElementsByName( "patentName" )[ currentPatentIndex ].innerHTML = name.value;

    if( image.files[0] ){
      const patentImg = document.getElementsByName( "patentImage" )[ currentPatentIndex ];

      patentImg.style.backgroundImage = `url( ${URL.createObjectURL( image.files[0] )} )`;
      patentImg.style.backgroundRepeat = "no-repeat";
      patentImg.style.backgroundSize = "contain";
      patentImg.style.backgroundPosition = "center center";
    }

    currentPatent.name = name.value;
    currentPatent.description = description.value;

    imageInput.value = "";
    imageInput.dispatchEvent( new Event( "change" ) );
    name.value = "";
    description.value = "";

    alert( `Патент ${currentPatent.serial_number} успешно изменён!` );

    overlay.close();
  }
}

async function index(){
  const overlay = new Overlay( document.querySelector( "#overlay" ), document.querySelector( "#overlayClose" ) );
  const patentIssueForm = new PatentIssueForm( overlay );
  const searchInput = document.querySelector( "#searchInput" );
  const searchContainer = document.querySelector( "#searchContainer" );
  const magnifier = document.querySelector( "#magnifier" );

  uploadControl( () => editPatent( overlay ) );

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
  document.querySelector( "#toolbarPencil" ).addEventListener( "click", () => deletePatent = true );
  document.querySelector( "#toolbarCross" ).addEventListener( "click", () => deletePatent = true );
}

window.addEventListener( "load", index );

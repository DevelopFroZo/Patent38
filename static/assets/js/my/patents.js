let overlay, patentDetail, patentContacts,
    patentEdit, patentIssueForm, isLogged,
    patentsCount, currentPatent,
    currentPatentIndex;

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

async function deletePatent( serialNumber, node ){
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

  document.querySelector( "#patentsRow" ).removeChild( node );
}

function addPatentsToDOM( patents ){
  const patentsRow = document.querySelector( "#patentsRow" );

  for( let i = 0; i < patents.length; i++ ){
    const node = createPatent( patents[i] );

    if( isLogged ){
      let div = document.createElement( "div" );
      const toolbar = document.createElement( "div" );

      div.innerHTML = "<img src = 'assets/img/pencil.png' />";
      div.addEventListener( "click", ( e ) => {
        const imageSelected = document.querySelector( "#imageSelected" );
        const imageInput = document.querySelector( "#imageInput" );

        imageInput.value = "";
        imageInput.dispatchEvent( new Event( "change" ) );

        imageSelected.style.backgroundImage = `url( assets/img/patents/${patents[i].serial_number}.jpg )`;
        imageSelected.style.backgroundRepeat = "no-repeat";
        imageSelected.style.backgroundSize = "cover";
        imageSelected.style.backgroundPosition = "center center";

        document.querySelector( "#imageUnselected" ).classList.add( "hidden" );
        imageSelected.classList.remove( "hidden" );
        document.querySelector( "#serialNumberInput" ).value = patents[i].serial_number;
        document.querySelector( "#nameInput" ).value = patents[i].name;
        document.querySelector( "#descriptionInput" ).value = patents[i].description;
        currentPatent = patents[i];
        // #fix ???
        currentPatentIndex = i;
        overlay.open();
        patentEdit.open();
      } );
      toolbar.className = "toolbar";
      toolbar.appendChild( div );

      div = document.createElement( "div" );
      div.innerHTML = '<img src = "assets/img/cross1.png" />';
      div.addEventListener( "click", () => deletePatent( patents[i].serial_number, node ) );
      toolbar.appendChild( div );

      node.getElementsByClassName( "patent-section" )[0].parentNode.insertBefore( toolbar, node.getElementsByClassName( "patent-section" )[0] );
    }

    node.getElementsByClassName( "patent-section" )[0].addEventListener( "click", () => {
      patentIssueForm.clear();
      patentIssueForm.fill( patents[i] );
      patentDetail.open();
      overlay.open();
    } );
    patentsRow.appendChild( node );
  };

  patentsCount += patents.length;
}

async function fetchPatents(){
  const response = await fetch( "api/patents/get" );
  const patents = ( await response.json() ).data;

  document.querySelector( "#patentsRow" ).innerHTML = "";
  patentsCount = 0;
  addPatentsToDOM( patents );
}

function patentContactsClose(){
  patentContacts.close();
  patentDetail.open();
}

async function searchPatents( patentIssueForm ){
  let search = document.querySelector( "#searchInput" ).value;

  document.querySelector( "#patentsRow" ).innerHTML = "";
  patentsCount = 0;
  search = search.replace( /  +/g, " " ).replace( / /g, "|" );

  const response = await fetch( `api/patents/get?search=${search}` );
  const patents = ( await response.json() ).data;

  addPatentsToDOM( patents );
}

async function savePatentHandler(){
  const name = document.querySelector( "#nameInput" );
  const image = document.querySelector( "#imageInput" );
  const description = document.querySelector( "#descriptionInput" );
  const formData = new FormData();
  let error;

  // #fix пустые значения

  formData.append( "serialNumber", currentPatent.serial_number );
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
      case 6: error = "Патент уже зарегистрирован"; break;
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
      patentImg.style.backgroundSize = "cover";
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
    patentEdit.close();
  }
}

async function index(){
  overlay = new Overlay( "overlay" );
  patentDetail = new Desk( "patentDetail" );
  patentContacts = new Desk( "patentContacts" );
  patentEdit = new Desk( "upload" );
  patentIssueForm = new PatentIssueForm();
  const searchInput = document.querySelector( "#searchInput" );
  patentsCount = 0;

  await navbarControl();
  fetchPatents();
  uploadControl();

  overlay.on( "esc", () => {
    if( patentDetail.isOpen ){
      overlay.close();
      patentDetail.close();
    }
    else if( patentContacts.isOpen ) patentContactsClose();
    else{
      overlay.close();
      patentEdit.close();
    }
  } );
  patentDetail.on( "close", () => {
    patentDetail.close();
    overlay.close();
  } );

  document.querySelector( "#patentBuy" ).addEventListener( "click", () => {
    patentDetail.close();
    patentContacts.open();
  } );

  patentContacts.on( "close", patentContactsClose );
  patentIssueForm.on( "success", () => {
    patentContacts.close();
    patentIssueForm.clear();
    overlay.close();
    patentDetail.open();
  } );

  searchInput.addEventListener( "keydown", ( e ) => {
    if( e.key === "Enter" ) searchPatents();
    else if( e.key === "Escape" ){
      searchInput.value = "";
      fetchPatents();
    }
  } );

  document.querySelector( "#magnifier" ).addEventListener( "click", searchPatents );

  patentEdit.on( "close", () => {
    patentEdit.close();
    overlay.close();
  } );

  document.querySelector( "#uploadButton" ).addEventListener( "click", savePatentHandler );
}

window.addEventListener( "load", index );

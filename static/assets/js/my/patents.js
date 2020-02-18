let overlay, patentDetail, patentContacts,
    patentEdit, categories, patentIssueForm,
    categories2, paginationTop, isLogged,
    patentsCount, currentPatent, currentPatentIndex,
    countOnPage, offset, allCount, search, categoryIds;

async function fetchCategories(){
  const response = await fetch( "/api/categories" );
  const categoriesData = ( await response.json() ).data;
  const transformed = categoriesData.map( category => [ category.name, category.id ] )

  categories.fill( transformed );
  categories2.fill( transformed );
}

async function navbarControl(){
  const response = await fetch( "api/auth/isLogged" );
  isLogged = ( await response.json() ).data;

  const authLink = document.querySelector( "#authLink" );
  const uploadLi = document.querySelector( "#uploadLi" );
  const categoriesLi = document.querySelector( "#categoriesLi" );

  if( isLogged ){
    authLink.href = "/logout";
    authLink.innerHTML = "ВЫЙТИ";

    uploadLi.classList.remove( "hidden" );
    categoriesLi.classList.remove( "hidden" );
  }
}

async function deletePatent( serialNumber, node ){
  const isConfirmed = confirm( `Вы точно хотите удалить патент №${serialNumber}?` );

  if( !isConfirmed ) return;

  const response = await fetch( "/api/patents", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( { serialNumber } )
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
        const items = categories.element.getElementsByTagName( "div" );

        imageInput.value = "";
        imageInput.dispatchEvent( new Event( "change" ) );

        imageSelected.style.backgroundImage = `url( assets/img/patents/${patents[i].serial_number}.${patents[i].ext} )`;
        imageSelected.style.backgroundRepeat = "no-repeat";
        imageSelected.style.backgroundSize = "cover";
        imageSelected.style.backgroundPosition = "center center";

        document.querySelector( "#imageUnselected" ).classList.add( "hidden" );
        imageSelected.classList.remove( "hidden" );
        document.querySelector( "#serialNumberInput" ).value = patents[i].serial_number;

        if( patents[i].category_id )
          for( let j = 0; j < items.length; j++ ){
            if( parseInt( items[j].getAttribute( "value" ) ) === patents[i].category_id ){
              categories.select( items[j] );
              break;
            }
          }
        else categories.unselect();

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
  const response = await fetch( `api/patents?count=${countOnPage}&offset=${offset}&search=${search}&categoryIds=${categoryIds}` );
  const data = ( await response.json() ).data;
  const patents = data.patents;
  allCount = data.count;

  document.querySelector( "#patentsRow" ).innerHTML = "";
  patentsCount = 0;
  addPatentsToDOM( patents );
}

function patentContactsClose(){
  patentContacts.close();
  patentDetail.open();
}

async function searchPatents( patentIssueForm ){
  search = document.querySelector( "#searchInput" ).value;
  categoryIds = categories2.values.join( "," );

  document.querySelector( "#patentsRow" ).innerHTML = "";
  patentsCount = 0;
  search = search.replace( /  +/g, " " ).replace( / /g, "|" );

  await fetchPatents();
  history.pushState( '', '', `/patents?count=${countOnPage}` );
  paginationTop.set( allCount, countOnPage, 0 );
}

async function savePatentHandler(){
  const name = document.querySelector( "#nameInput" );
  const category = document.querySelector( "#categoryHeader" );
  const image = document.querySelector( "#imageInput" );
  const description = document.querySelector( "#descriptionInput" );
  const formData = new FormData();
  let error;

  // #fix пустые значения

  formData.append( "serialNumber", currentPatent.serial_number );
  formData.append( "categoryId", parseInt( category.getAttribute( "value" ) ) );
  formData.append( "name", name.value );
  formData.append( "image", image.files[0] );
  formData.append( "description", description.value );

  const response = await fetch( `api/patents/${currentPatent.serial_number}`, {
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
    currentPatent.category_id = parseInt( category.getAttribute( "value" ) );
    currentPatent.category_name = category.innerHTML;

    imageInput.value = "";
    imageInput.dispatchEvent( new Event( "change" ) );
    name.value = "";
    description.value = "";

    alert( `Патент ${currentPatent.serial_number} успешно изменён!` );

    overlay.close();
    patentEdit.close();
  }
}

function changeCountOnPage(){
  const countOnPage3 = document.querySelector( "#countOnPage3" );
  const countOnPage6 = document.querySelector( "#countOnPage6" );
  const countOnPage9 = document.querySelector( "#countOnPage9" );

  countOnPage3.classList.remove( "current-count" );
  countOnPage6.classList.remove( "current-count" );
  countOnPage9.classList.remove( "current-count" );

  document.querySelector( `#countOnPage${countOnPage}` ).classList.add( "current-count" );
}

async function index(){
  overlay = new Overlay( "overlay" );
  patentDetail = new Desk( "patentDetail" );
  patentContacts = new Desk( "patentContacts" );
  patentEdit = new Desk( "upload" );
  categories = new SelectList( "categories" );
  patentIssueForm = new PatentIssueForm();
  categories2 = new CheckboxList( "categories" );
  paginationTop = new Pagination( "paginationTop" );
  const searchInput = document.querySelector( "#searchInput" );
  patentsCount = 0;
  const checkAll = document.querySelector( "#checkAll" );
  const query = new URLSearchParams( window.location.search );
  countOnPage = query.get( "count" );
  countOnPage = countOnPage ? parseInt( countOnPage ) : 3;
  offset = query.get( "offset" );
  offset = offset ? parseInt( offset ) : 0;
  search = "";
  categoryIds = "";

  changeCountOnPage();

  fetchCategories();
  await navbarControl();
  await fetchPatents();
  paginationTop.set( allCount, countOnPage, offset );
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

  categories.on( "select", ( e ) => {
    const categoryHeader = document.querySelector( "#categoryHeader" );

    categoryHeader.style.color = "#000000";
    categoryHeader.setAttribute( "value", e.detail.getAttribute( "value" ) );
    categoryHeader.innerHTML = e.detail.innerHTML;
  } );
  categories.on( "unselect", () => {
    categoryHeader.removeAttribute( "value" );
    categoryHeader.innerHTML = "Категория";
  } );

  categories2.on( "check", ( e ) => {
    const items = e.target.getElementsByTagName( "div" );

    if(
      categories2.values.length === items.length ||
      checkAll.getAttribute( "checked" ) !== null
    ){
      checkAll.toggleAttribute( "checked" );
      checkAll.classList.toggle( "checked" );
    }

    searchPatents();
  } );

  checkAll.addEventListener( "click", ( e ) => {
    checkAll.toggleAttribute( "checked" );
    checkAll.classList.toggle( "checked" );

    const checked = checkAll.getAttribute( "checked" ) !== null;

    if( checked ) categories2.checkAll();
    else categories2.uncheckAll();

    searchPatents();
  } );

  paginationTop.on( "change", ( e ) => {
    offset = e.detail;
    history.pushState( '', '', `/patents?count=${countOnPage}&offset=${offset}` );

    fetchPatents();
  } );

  const countOnPage3 = document.querySelector( "#countOnPage3" );
  const countOnPage6 = document.querySelector( "#countOnPage6" );
  const countOnPage9 = document.querySelector( "#countOnPage9" );

  countOnPage3.addEventListener( "click", async () => {
    if( countOnPage === 3 ) return;

    countOnPage = 3;
    offset = 0;
    history.pushState( '', '', `/patents?count=${countOnPage}` );
    changeCountOnPage();
    await fetchPatents();
    paginationTop.set( allCount, countOnPage, 0 );
  } );
  countOnPage6.addEventListener( "click", async () => {
    if( countOnPage === 6 ) return;

    countOnPage = 6;
    offset = 0;
    history.pushState( '', '', `/patents?count=${countOnPage}` );
    changeCountOnPage();
    await fetchPatents();
    paginationTop.set( allCount, countOnPage, 0 );
  } );
  countOnPage9.addEventListener( "click", async () => {
    if( countOnPage === 9 ) return;

    countOnPage = 9;
    offset = 0;
    history.pushState( '', '', `/patents?count=${countOnPage}` );
    changeCountOnPage();
    await fetchPatents();
    paginationTop.set( allCount, countOnPage, 0 );
  } );
}

window.addEventListener( "load", index );

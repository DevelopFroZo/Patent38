let overlay, patentDetail, patentContacts, patentIssueForm;

async function fetchPatents( patentIssueForm ){
  const response = await fetch( "api/patents/get?count=3" );
  const patents = ( await response.json() ).data;
  const patentsRow = document.querySelector( "#patentsRow" );

  patents.forEach( patent => {
    const node = createPatent( patent );

    node.getElementsByClassName( "patent-section" )[0].addEventListener( "click", () => {
      patentIssueForm.clear();
      patentIssueForm.fill( patent );
      overlay.open();
    } );
    patentsRow.appendChild( node );
  } );
}

// #fix
async function navbarControl(){
  const response = await fetch( "api/auth/isLogged" );
  const isLogged = ( await response.json() ).data;

  const authLink = document.querySelector( "#authLink" );
  const uploadLi = document.querySelector( "#uploadLi" );

  if( isLogged ){
    authLink.href = "/logout";
    authLink.innerHTML = "ВЫЙТИ";

    uploadLi.classList.toggle( "hidden" );
  }
}

function patentContactsClose(){
  patentContacts.close();
  patentDetail.open();
}

function index(){
  overlay = new Overlay( "overlay" );
  patentDetail = new Desk( "patentDetail" );
  patentContacts = new Desk( "patentContacts" );
  const patentIssueForm = new PatentIssueForm();

  fetchPatents( patentIssueForm );
  navbarControl();

  overlay.on( "esc", () => {
    if( patentDetail.isOpen ) overlay.close();
    else patentContactsClose();
  } );
  patentDetail.open();
  patentDetail.on( "close", () => overlay.close() );

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
}

window.addEventListener( "load", index );

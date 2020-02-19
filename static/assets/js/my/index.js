let
  overlay, patentDetail, patentContacts,
  patentIssueForm, isPatentIssue, service;

async function fetchPatents(){
  const response = await fetch( "api/patents?count=3" );
  const data = ( await response.json() ).data;
  const patentsRow = document.querySelector( "#patentsRow" );
  const patents = data.patents;

  patents.forEach( patent => {
    const node = createPatent( patent );

    node.getElementsByClassName( "patent-section" )[0].addEventListener( "click", () => {
      isPatentIssue = true;
      patentIssueForm.clear();
      patentIssueForm.fill( patent );
      patentDetail.open();
      overlay.open();
    } );
    patentsRow.appendChild( node );
  } );
}

function patentContactsClose(){
  if( isPatentIssue ){
    patentContacts.close();
    patentDetail.open();
  } else {
    overlay.close();
    patentContacts.close();
  }
}

async function issueService(){
  const name = document.querySelector( "#contactName" ).value;
  const email = document.querySelector( "#contactEmail" ).value;
  const phone = document.querySelector( "#contactPhone" ).value;

  const response = await fetch( "/api/services/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( { name, email, phone, service } )
  } );
  const jsn = await response.json();

  if( !jsn.ok )
    return alert( "Ошибка оформления услуги" );

  alert( "Заявка на оформление услуги успешно отправлена!" );

  overlay.close();
  patentContacts.close();
  patentIssueForm.clear();
}

function priceIssue(){
  const priceIssueA = document.getElementsByName( "priceIssue" );

  for( let i = 0; i < priceIssueA.length; i++ ){
    priceIssueA[i].addEventListener( "click", () => {
      isPatentIssue = false;
      overlay.open();
      patentContacts.open();
      service = priceIssueA[i].getAttribute( "value" );
    } );
  }
}

function index(){
  overlay = new Overlay( "overlay" );
  patentDetail = new Desk( "patentDetail" );
  patentContacts = new Desk( "patentContacts" );
  patentIssueForm = new PatentIssueForm();

  fetchPatents();
  priceIssue();

  overlay.on( "esc", () => {
    if( isPatentIssue && patentDetail.isOpen ){
      overlay.close();
      patentDetail.close();
    }
    else patentContactsClose();
  } );
  patentDetail.on( "close", () => {
    overlay.close();
    patentDetail.close();
  } );

  document.querySelector( "#patentBuy" ).addEventListener( "click", () => {
    patentDetail.close();
    patentContacts.open();
  } );

  patentContacts.on( "close", patentContactsClose );

  patentIssueForm.on( "issue", () => {
    if( isPatentIssue ) patentIssueForm.issue();
    else issueService();
  } );

  patentIssueForm.on( "success", () => {
    patentContacts.close();
    patentIssueForm.clear();
    overlay.close();
  } );
}

window.addEventListener( "load", index );

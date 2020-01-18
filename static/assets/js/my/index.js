async function fetchPatents( patentIssueForm ){
  const response = await fetch( "api/patents/get?count=3" );
  const patents = ( await response.json() ).data;

  for( let i = 0; i < patents.length; i++ ) fillPatent( patents, i, patentIssueForm );
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

function index(){
  const overlay = new Overlay( document.querySelector( "#overlay" ), document.querySelector( "#overlayClose" ) );
  const patentIssueForm = new PatentIssueForm( overlay );

  fetchPatents( patentIssueForm );
  navbarControl();

  document.body.addEventListener( "keydown", ( e ) => overlay.closeByEscape( e ) );
}

window.addEventListener( "load", index );

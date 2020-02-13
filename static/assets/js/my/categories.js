"use strict";

async function fetchCategories(){
  const response = await fetch( "/api/categories" );
  const categories = ( await response.json() ).data;

  return categories;
}

function showEdit( preview, edit ){
  edit.value = preview.innerHTML;

  preview.classList.toggle( "hidden" );
  edit.classList.toggle( "hidden" );

  edit.focus();
}

function hideEdit( preview, edit ){
  preview.innerHTML = edit.value;

  edit.classList.toggle( "hidden" );
  preview.classList.toggle( "hidden" );
}

async function editSaveHandler( e, preview, edit ){
  if( e.key !== "Enter" ) return;

  const cid = edit.getAttribute( "cid" );
  const name = edit.value;

  await fetch( `/api/categories/${cid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( { name } )
  } );

  hideEdit( preview, edit );
}

function editBlurHandler( preview, edit ){
  if( preview.innerHTML !== edit.value ) return;

  hideEdit( preview, edit );
}

async function index(){
  const categories = await fetchCategories();
  const categoryList = document.querySelector( "#categoryList" );

  categories.forEach( category => {
    const li = document.createElement( "li" );
    const cont = document.createElement( "div" );
    const preview = document.createElement( "div" );
    const edit = document.createElement( "input" );

    preview.classList.add( "preview" );
    preview.innerHTML = category.name;
    preview.addEventListener( "click", () => showEdit( preview, edit ) );
    cont.appendChild( preview );

    edit.setAttribute( "type", "text" );
    edit.setAttribute( "cid", category.id );
    edit.classList.add( "edit" );
    edit.classList.add( "hidden" );
    edit.addEventListener( "keydown", ( e ) => editSaveHandler( e, preview, edit ) );
    edit.addEventListener( "blur", () => editBlurHandler( preview, edit ) );
    cont.appendChild( edit );

    li.appendChild( cont );

    categoryList.appendChild( li );
  } );
}

window.addEventListener( "load", index );

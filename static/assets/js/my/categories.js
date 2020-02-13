"use strict";

async function fetchCategories(){
  const response = await fetch( "/api/categories" );
  const categories = ( await response.json() ).data;

  return categories;
}

function addCategoryToDOM( category ){
  const categoryList = document.querySelector( "#categoryList" );

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

  let name = edit.value;

  if( name === "" ){
    edit.value = preview.innerHTML;
    name = preview.innerHTML;
  }

  if( preview.innerHTML !== name ){
    const cid = edit.getAttribute( "cid" );

    await fetch( `/api/categories/${cid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( { name } )
    } );
  }

  hideEdit( preview, edit );
}

function editBlurHandler( preview, edit ){
  if(
    preview.innerHTML !== edit.value ||
    edit.classList.contains( "hidden" )
  ) return;

  hideEdit( preview, edit );
}

async function createCategory(){
  const addInput = document.querySelector( "#addInput" );
  const name = addInput.value;

  if( name === "" ) return;

  const response = await fetch( "/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( { name } )
  } );
  const jsn = await response.json();

  if( !jsn.ok ) return alert( `Ошибка: ${jsn.message}` );

  addInput.value = "";

  addCategoryToDOM( {
    id: jsn.data,
    name
  } );
}

function addInputKeyDownHandler( e ){
  if( e.key !== "Enter" ) return;

  createCategory();
}

async function index(){
  const categories = await fetchCategories();

  categories.forEach( addCategoryToDOM );
  document.querySelector( "#addInput" ).addEventListener( "keydown", addInputKeyDownHandler );
  document.querySelector( "#addButton" ).addEventListener( "click", createCategory );
}

window.addEventListener( "load", index );

"use strict";

async function fetchCategories(){
  const response = await fetch( "/api/categories" );
  const categories = ( await response.json() ).data;

  return categories;
}

function showEdit( category, title, edit, toolbarPencil ){
  category.style.borderBottom = "rgb( 255, 0, 0 ) 1px solid";
  edit.value = title.innerHTML;
  title.classList.toggle( "hidden" );
  edit.classList.toggle( "hidden" );
  edit.focus();
  toolbarPencil.classList.toggle( "hidden" );
}

function hideEdit( category, title, edit, toolbarPencil ){
  category.style.borderBottom = "#6F6F6F 1px solid";
  title.innerHTML = edit.value;
  edit.classList.toggle( "hidden" );
  title.classList.toggle( "hidden" );
  toolbarPencil.classList.toggle( "hidden" );
}

async function editSaveHandler( e, category, title, edit, toolbarPencil ){
  if( e.key !== "Enter" ) return;

  let name = edit.value;

  if( name === "" ){
    edit.value = title.innerHTML;
    name = title.innerHTML;
  }

  if( title.innerHTML !== name ){
    const cid = edit.getAttribute( "cid" );

    await fetch( `/api/categories/${cid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( { name } )
    } );
  }

  hideEdit( category, title, edit, toolbarPencil );
}

function editBlurHandler( category, title, edit, toolbarPencil ){
  if(
    title.innerHTML !== edit.value ||
    edit.classList.contains( "hidden" )
  ) return;

  hideEdit( category, title, edit, toolbarPencil );
}

async function deleteHandler( category, edit ){
  let confirmed = confirm( "Удалить категорию?" );

  if( !confirmed ) return;

  const cid = edit.getAttribute( "cid" );

  const response = await fetch( `/api/categories/${cid}`, {
    method: "DELETE"
  } );

  const jsn = await response.json();
  const categories = document.querySelector( "#categories" );

  if( !jsn.ok ){
    alert( `Ошибка. ${jsn.message}` );

    return;
  }

  categories.removeChild( category );
}

function addCategoryToDOM( category ){
  const categories = document.querySelector( "#categories" );

  const category_ = document.createElement( "div" );
  const title = document.createElement( "div" );
  const edit = document.createElement( "input" );
  const toolbarPencil = document.createElement( "div" );
  const toolbarCross = document.createElement( "div" );

  category_.classList.add( "category" );

  title.classList.add( "title" );
  title.innerHTML = category.name;
  category_.appendChild( title );

  edit.setAttribute( "type", "text" );
  edit.setAttribute( "cid", category.id );
  edit.classList.add( "edit" );
  edit.classList.add( "hidden" );
  edit.addEventListener( "keydown", ( e ) => editSaveHandler( e, category_, title, edit, toolbarPencil ) );
  edit.addEventListener( "blur", () => editBlurHandler( category_, title, edit, toolbarPencil ) );
  category_.appendChild( edit );

  toolbarPencil.setAttribute( "class", "toolbar-item" );
  toolbarPencil.addEventListener( "click", () => showEdit( category_, title, edit, toolbarPencil ) );
  category_.appendChild( toolbarPencil );

  let toolbarImg = document.createElement( "img" );
  toolbarImg.setAttribute( "src", "assets/img/pencil-light.png" );
  toolbarPencil.appendChild( toolbarImg );

  toolbarCross.setAttribute( "class", "toolbar-item" );
  toolbarCross.addEventListener( "click", () => deleteHandler( category_, edit ) );
  category_.appendChild( toolbarCross );

  toolbarImg = document.createElement( "img" );
  toolbarImg.setAttribute( "src", "assets/img/cross-light.png" );
  toolbarCross.appendChild( toolbarImg );

  categories.appendChild( category_ );
}

// async function createCategory(){
//   const addInput = document.querySelector( "#addInput" );
//   const name = addInput.value;
//
//   if( name === "" ) return;
//
//   const response = await fetch( "/api/categories", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify( { name } )
//   } );
//   const jsn = await response.json();
//
//   if( !jsn.ok ) return alert( `Ошибка: ${jsn.message}` );
//
//   addInput.value = "";
//
//   addCategoryToDOM( {
//     id: jsn.data,
//     name
//   } );
// }
//
// function addInputKeyDownHandler( e ){
//   if( e.key !== "Enter" ) return;
//
//   createCategory();
// }

function addCategoryShow(){
  const addCategory = document.querySelector( "#addCategory" );

  if( !addCategory.classList.contains( "hidden" ) ) return;

  const addCategoryInput = document.querySelector( "#addCategoryInput" );

  addCategoryInput.value = "";
  addCategory.classList.toggle( "hidden" );
  addCategoryInput.focus();
}

function addCategoryHide(){
  document.querySelector( "#addCategory" ).classList.add( "hidden" );
}

async function createCategory( e ){
  if( e.key === "Escape" ) return addCategoryHide();
  else if( e.key !== "Enter" ) return;

  const name = e.target.value;

  if( name !== "" ){
    const response = await fetch( "/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( { name } )
    } );
    const jsn = await response.json();

    if( !jsn.ok ) return alert( `Ошибка. ${jsn.message}` );

    addCategoryHide();
    addCategoryToDOM( {
      id: jsn.data,
      name
    } );
  }
}

function addCategoryBlurHandler( e ){
  if( e.target.value === "" ) addCategoryHide();
}

async function index(){
  const categories = await fetchCategories();
  const addCategoryInput = document.querySelector( "#addCategoryInput" );

  categories.forEach( addCategoryToDOM );
  // document.querySelector( "#addInput" ).addEventListener( "keydown", addInputKeyDownHandler );
  // document.querySelector( "#addButton" ).addEventListener( "click", createCategory );
  document.querySelector( "#newCategory" ).addEventListener( "click", addCategoryShow );
  addCategoryInput.addEventListener( "keydown", createCategory );
  addCategoryInput.addEventListener( "blur", addCategoryBlurHandler );
}

window.addEventListener( "load", index );

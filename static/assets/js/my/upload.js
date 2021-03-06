"use strict";

let selectList;

async function fetchCategories( selectList ){
  const response = await fetch( "/api/categories" );
  const categories = ( await response.json() ).data;

  selectList.fill( categories.map( category => [ category.name, category.id ] ) );
}

async function uploadButtonHandler(){
  const serialNumber = document.querySelector( "#serialNumberInput" );
  const categoryId = document.querySelector( "#categoryHeader" );
  const name = document.querySelector( "#nameInput" );
  const image = document.querySelector( "#imageInput" );
  const description = document.querySelector( "#descriptionInput" );
  const formData = new FormData();
  let error;

  // #fix пустые значения

  formData.append( "serialNumber", parseInt( serialNumber.value ) );
  formData.append( "categoryId", parseInt( categoryId.getAttribute( "value" ) ) );
  formData.append( "name", name.value );
  formData.append( "image", image.files[0] );
  formData.append( "description", description.value );

  const response = await fetch( "api/patents/upload", {
    method: "POST",
    body: formData
  } );
  const jsn = await response.json();

  if( !jsn.ok ){
    switch( jsn.code ){
      case 1: error = "Проблема с базой данных"; break;
      case 4: error = "Изображение не выбрано"; break;
      case 5: error = "Неверный номер патента"; break;
      case 6: error = "Патент уже зарегистрирован"; break;
      case 7: error = "Проблема с добавлением изображения"; break;
    }

    alert( `Ошибка. ${error}` );
  }
  else {
    imageInput.value = "";
    imageInput.dispatchEvent( new Event( "change" ) );
    serialNumber.value = "";
    selectList.unselect();
    document.querySelector( "#categoryHeader" ).innerHTML = "Категория";
    name.value = "";
    description.value = "";

    alert( `Патент ${serialNumber.value} успешно добавлен!` );
  }
}

function index(){
  const upload = new Desk( "upload" );
  selectList = new SelectList( "categories" );

  fetchCategories( selectList );
  uploadControl();

  upload.open();
  document.querySelector( "#uploadButton" ).addEventListener( "click", uploadButtonHandler );

  selectList.on( "select", ( e ) => {
    const categoryHeader = document.querySelector( "#categoryHeader" );

    categoryHeader.style.color = "#000000";
    categoryHeader.setAttribute( "value", e.detail.getAttribute( "value" ) );
    categoryHeader.innerHTML = e.detail.innerHTML;
  } );
}

window.addEventListener( "load", index );

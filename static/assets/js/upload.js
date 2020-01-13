"use strict";

async function uploadButtonHandler(){
  const serialNumber = parseInt( document.querySelector( "#serialNumberInput" ).value );
  const image = document.querySelector( "#imageInput" ).files[0];
  const description = document.querySelector( "#descriptionInput" ).value;
  const formData = new FormData();

  formData.append( "serialNumber", serialNumber );
  formData.append( "image", image );
  formData.append( "description", description );

  const response = await fetch( "api/patents/upload", {
    method: "POST",
    body: formData
  } );
  const jsn = await response.json();

  console.log( jsn );
}

function index(){
  document
    .querySelector( "#uploadButton" )
    .addEventListener( "click", uploadButtonHandler );
}

window.addEventListener( "load", index );

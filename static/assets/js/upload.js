"use strict";

async function uploadButtonHandler(){
  // const serialNumber = parseInt( document.querySelector( "#serialNumberInput" ).value );
  // const image = document.querySelector( "#imageInput" ).files[0];
  // const description = document.querySelector( "#descriptionInput" ).value;
  // const formData = new FormData();
  //
  // formData.append( "serialNumber", serialNumber );
  // formData.append( "image", image );
  // formData.append( "description", description );
  //
  // const response = await fetch( "api/patents/upload", {
  //   method: "POST",
  //   body: formData
  // } );
  // const jsn = await response.json();
  //
  // console.log( jsn );
}

function uploadImageZoneHack(){
  const imageInput = document.querySelector( "#imageInput" );
  const imageUnselected = document.querySelector( "#imageUnselected" );
  const imageSelected = document.querySelector( "#imageSelected" );

  imageInput.addEventListener( "change", function( e ){
    console.log(  );

    if( this.files.length === 0 ){
      imageUnselected.classList.remove( "hidden" );
      imageSelected.classList.add( "hidden" );
    }
    else if( imageInput.files[0].size / 1024 / 1024 > 1 ){
      imageInput.value = "";

      alert( "Размер изображения должен быть меньше 1 МБ" );
    } else {
      imageSelected.style.backgroundImage = `url( ${URL.createObjectURL( this.files[0] )} )`;
      imageSelected.style.backgroundRepeat = "no-repeat";
      imageSelected.style.backgroundSize = "contain";
      imageSelected.style.backgroundPosition = "center center";

      imageUnselected.classList.add( "hidden" );
      imageSelected.classList.remove( "hidden" );
    }
  } );

  imageUnselected.addEventListener( "click", () => imageInput.click() );
}

function index(){
  const imageInput = document.querySelector( "#imageInput" );

  uploadImageZoneHack();

  document
    .querySelector( "#imageEdit" )
    .addEventListener( "click", () => imageInput.click() );

  document
    .querySelector( "#imageDelete" )
    .addEventListener( "click", () => {
      imageInput.value = "";
      imageInput.dispatchEvent( new Event( "change" ) )
    } );
}

window.addEventListener( "load", index );

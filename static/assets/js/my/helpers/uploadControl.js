function uploadControl( uploadButtonHandler ){
  const imageInput = document.querySelector( "#imageInput" );
  const imageUnselected = document.querySelector( "#imageUnselected" );
  const imageSelected = document.querySelector( "#imageSelected" );

  imageInput.addEventListener( "change", function( e ){
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
      imageSelected.style.backgroundSize = "cover";
      imageSelected.style.backgroundPosition = "center center";

      imageUnselected.classList.add( "hidden" );
      imageSelected.classList.remove( "hidden" );
    }
  } );

  imageSelected.addEventListener( "click", () => imageInput.click() );
  imageUnselected.addEventListener( "click", () => imageInput.click() );
}

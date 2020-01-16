"use strict";

async function signinButtonHandler(){
  const login = document.querySelector( "#loginInput" ).value;
  const password = document.querySelector( "#passwordInput" ).value;
  const response = await fetch( "api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify( {
      login,
      password
    } )
  } );

  if( response.redirected ){
    window.open( response.url, "_self" );

    return;
  }

  if( !response.ok ){
    console.log( response );

    return;
  }

  const jsn = await response.json();

  // #fix обработка ошибки
  console.log( jsn );
}

function index(){
  document
    .querySelector( "#signinButton" )
    .addEventListener( "click", signinButtonHandler );
}

window.addEventListener( "load", index );

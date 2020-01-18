"use strict";

class Overlay{
  constructor( dom, closeButton ){
    this.dom = dom;
    this.isOpen_ = false;

    closeButton.addEventListener( "click", () => this.close() );
  }

  open(){
    this.dom.classList.remove( "hidden" );
    document.body.style.overflowY = "hidden";
    this.isOpen_ = true;
  }

  close(){
    this.dom.classList.add( "hidden" );
    document.body.style.overflowY = "auto";
    this.isOpen_ = false;
  }

  closeByEscape( e ){
    if( e.key === "Escape" ) this.close();
  }
}

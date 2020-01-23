class Desk{
  constructor( id, width, height ){
    const desks = document.getElementsByTagName( "desk" );

    for( let i = 0; i < desks.length; i++ )
      if( desks[i].getAttribute( "data-id" ) === id ){
        this.init( desks[i], width, height );

        return;
      }

    throw `Fail to load desk with id "${id}"`;
  }

  createEvents(){
    this.dom.getElementsByTagName( "img" )[0].addEventListener( "click", () => {
      this.dom.dispatchEvent( new Event( "close" ) );
    } );
  }

  init( dom, width, height ){
    this.dom = dom;
    this.isOpen = false;

    if( width ) dom.style.width = width;
    if( height ) dom.style.height = height;

    this.createEvents();
  }

  on( e, handler ){
    this.dom.addEventListener( e, handler );
  }

  open(){
    this.dom.style.display = "flex";
    this.isOpen = true;
  }

  close(){
    this.dom.style.display = "none";
    this.isOpen = false;
  }
}

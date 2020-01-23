class Overlay{
  constructor( id ){
    const overlays = document.getElementsByTagName( "overlay" );

    for( let i = 0; i < overlays.length; i++ )
      if( overlays[i].getAttribute( "data-id" ) === id ){
        this.init( overlays[i] );

        return;
      }

    throw `Fail to load overlay with id "${id}"`;
  }

  createEvents(){
    document.body.addEventListener( "keydown", ( e ) => {
      if( this.isOpen && e.key === "Escape" )
        this.dom.dispatchEvent( new Event( "esc" ) );
    } );
  }

  init( dom ){
    dom.classList.add( "overlay" );

    this.dom = dom;
    this.isOpen = false;

    this.createEvents();
  }

  on( e, handler ){
    this.dom.addEventListener( e, handler );
  }

  open(){
    this.dom.style.display = "flex";
    document.body.style.overflowY = "hidden";
    this.isOpen = true;
  }

  close(){
    document.body.style.overflowY = "auto";
    this.dom.style.display = "none";
    this.isOpen = true;
  }
}

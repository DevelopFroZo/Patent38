class SelectList{
  constructor( id ){
    const elements = document.getElementsByTagName( "selectList" );

    for( let i = 0; i < elements.length; i++ ){
      const element = elements[i];

      if( element.getAttribute( "data-id" ) === id ){
        this.element = element;
        this.init();

        return;
      }
    }

    throw `No seletc list with data-id "${id}"`;
  }

  select( item ){
    if( item === null ) this.clear();
    if( this.selected === item ) return;
    if( this.selected ) this.selected.classList.toggle( "selected" );

    item.classList.toggle( "selected" );
    this.selected = item;
    this.element.dispatchEvent( new CustomEvent( "select", { detail: item } ) );
  }

  unselect(){
    if( this.selected ) this.selected.classList.toggle( "selected" );

    this.selected = null;
    this.element.dispatchEvent( new Event( "unselect" ) );
  }

  init(){
    const items = this.element.getElementsByTagName( "div" );

    this.selected = null;

    for( let i = 0; i < items.length; i++ ){
      const item = items[i];

      if( item.getAttribute( "selected" ) !== null )
        this.select( item );

      item.addEventListener( "click", () => this.select( item ) );
    }
  }

  on( e, callback ){
    this.element.addEventListener( e, callback );
  }

  clear(){
    this.selected = null;
    this.element.innerHTML = "";
  }

  add( text, value ){
    const div = document.createElement( "div" );

    if( text === undefined ) text = null;

    if( value ) div.setAttribute( "value", value );

    div.addEventListener( "click", () => this.select( div ) );
    div.innerHTML = text;
    this.element.appendChild( div );
  }

  fill( data ){
    this.clear();
    data.forEach( item => this.add( item[0], item[1] ) );
  }
}

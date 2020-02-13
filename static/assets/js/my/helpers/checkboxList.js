class CheckboxList{
  constructor( id ){
    const elements = document.getElementsByTagName( "checkboxList" );

    for( let i = 0; i < elements.length; i++ ){
      const element = elements[i];

      if( element.getAttribute( "data-id" ) === id ){
        this.element = element;
        this.init();

        return;
      }
    }

    throw `No checkbox list with data-id "${id}"`;
  }

  check( item ){
    const value = item.getAttribute( "value" );

    item.toggleAttribute( "checked" );
    item.classList.toggle( "checked" );

    if( this.values.includes( value ) )
      this.values = this.values.filter( value0 => value0 !== value );
    else
      this.values.push( value );

    this.element.dispatchEvent( new CustomEvent( "check", { detail: item } ) );
  }

  init(){
    const items = this.element.getElementsByTagName( "div" );

    this.values = [];

    for( let i = 0; i < items.length; i++ ){
      const item = items[i];

      if( item.getAttribute( "checked" ) !== null ){
        item.classList.add( "checked" );
        this.values.push( item.getAttribute( "value" ) );
      }

      item.addEventListener( "click", () => this.check( item ) );
    }
  }

  on( e, callback ){
    this.element.addEventListener( e, callback );
  }

  clear(){
    this.values = [];
    this.element.innerHTML = "";
  }

  add( text, value ){
    const div = document.createElement( "div" );

    if( value ) div.setAttribute( "value", value );

    div.addEventListener( "click", () => this.check( div ) );
    div.innerHTML = text;
    this.element.appendChild( div );
  }

  fill( data ){
    this.clear();
    data.forEach( item => this.add( item[0], item[1] ) );
  }
}

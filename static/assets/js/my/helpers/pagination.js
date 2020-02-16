class Pagination{
  constructor( id ){
    const elements = document.getElementsByTagName( "pagination" );

    for( let i = 0; i < elements.length; i++ ){
      const element = elements[i];

      if( element.getAttribute( "data-id" ) === id ){
        this.element = element;
        this.init();

        return;
      }
    }

    throw `No pagination with data-id "${id}"`;
  }

  addPage( page ){
    const button = document.createElement( "button" );

    button.innerHTML = page;
    button.addEventListener( "click", () => this.setOffset( ( page - 1 ) * this.countOnPage ) );
    this.customPages.appendChild( button );

    return button;
  }

  create(){
    const lastPage = Math.ceil( this.allCount / this.countOnPage );
    const currentPage = this.offset / this.countOnPage + 1;
    let button;

    this.firstPage.classList.remove( "current-page" );
    this.leftDots.classList.add( "hidden" );
    this.customPages.innerHTML = "";
    this.rightDots.classList.add( "hidden" );
    this.lastPage.classList.remove( "hidden" );
    this.lastPage.classList.remove( "current-page" );
    this.lastPage.innerHTML = lastPage;

    if( currentPage > 3 ){
      this.leftDots.classList.remove( "hidden" );
    }

    if( currentPage > 2 ) this.addPage( currentPage - 1 );

    if( currentPage === 1 ) this.firstPage.classList.add( "current-page" );
    else if( currentPage === lastPage ) this.lastPage.classList.add( "current-page" );
    else{
      const page = this.addPage( currentPage );

      page.classList.add( "current-page" );
    }

    if( currentPage < lastPage - 1 ) this.addPage( currentPage + 1 );

    if( currentPage < lastPage - 2 ){
      this.rightDots.classList.remove( "hidden" );
    }

    if( allCount <= countOnPage ) this.lastPage.classList.add( "hidden" );
  }

  setOffset( offset ){
    const maxCount = ( Math.ceil( this.allCount / this.countOnPage ) - 1 ) * this.countOnPage;

    if( offset === this.offset || offset < 0 || offset > maxCount ) return;

    this.offset = offset;
    this.create();

    this.element.dispatchEvent( new CustomEvent( "change", { detail: offset } ) );
  }

  decPage(){
    this.setOffset( this.offset - this.countOnPage );
  }

  incPage(){
    this.setOffset( this.offset + this.countOnPage );
  }

  init(){
    this.leftArrows = this.element.getElementsByClassName( "left-arrows" )[0];
    this.firstPage = this.element.getElementsByClassName( "first-page" )[0];
    this.leftDots = this.element.getElementsByClassName( "left-dots" )[0];
    this.customPages = this.element.getElementsByClassName( "custom-pages" )[0];
    this.rightDots = this.element.getElementsByClassName( "right-dots" )[0];
    this.lastPage = this.element.getElementsByClassName( "last-page" )[0];
    this.rightArrows = this.element.getElementsByClassName( "right-arrows" )[0];

    this.leftArrows.addEventListener( "click", () => this.decPage() );
    this.firstPage.addEventListener( "click", () => this.setOffset( 0 ) );
    this.lastPage.addEventListener( "click", () => this.setOffset( ( Math.ceil( this.allCount / this.countOnPage ) - 1 ) * this.countOnPage ) );
    this.rightArrows.addEventListener( "click", () => this.incPage() );
  }

  set( allCount, countOnPage, offset ){
    this.allCount = allCount;
    this.countOnPage = countOnPage;
    this.offset = offset;

    this.create();
  }

  on( e, callback ){
    this.element.addEventListener( e, callback );
  }
}

class PatentIssueForm{
  constructor(){
    this.image = document.querySelector( "#patentDetailImage" );
    this.serialNumber = document.querySelector( "#patentDetailSerialNumber" );
    this.category = document.querySelector( "#patentDetailCategory" );
    this.name = document.querySelector( "#patentDetailName" );
    this.description = document.querySelector( "#patentDetailDescription" );

    this.patentDetail = document.querySelector( "#patentDetail" );
    this.contacts = document.querySelector( "#patentContacts" );
    this.issue_ = document.querySelector( "#issue" );
    this.contactName = document.querySelector( "#contactName" );
    this.contactEmail = document.querySelector( "#contactEmail" );
    this.contactPhone = document.querySelector( "#contactPhone" );
    this.contactsPersonal = document.querySelector( "#contactsPersonal" );

    this.contactsPersonal.addEventListener( "change", ( e ) => this.issueToggle( e ) );
    this.issue_.addEventListener( "click", () => this.issue() );
  }

  clear(){
    this.contactName.value = "";
    this.contactEmail.value = "";
    this.contactPhone.value = "";
    this.contactsPersonal.checked = false;
    this.issue_.classList.add( "disabled" );
    this.issue_.classList.remove( "enabled" );
    this.issue_.disabled = true;
  }

  issueToggle( e ){
    if( e.target.checked ){
      this.issue_.classList.remove( "disabled" );
      this.issue_.classList.add( "enabled" );
    } else {
      this.issue_.classList.add( "disabled" );
      this.issue_.classList.remove( "enabled" );
    }

    this.issue_.disabled = !e.target.checked;
  }

  fill( patent ){
    this.patent = patent;

    this.image.style.backgroundImage = `url( "assets/img/patents/${patent.serial_number}.${patent.ext}" )`;
    this.image.style.backgroundRepeat = "no-repeat";
    this.image.style.backgroundSize = "cover";
    this.image.style.backgroundPosition = "center center";

    this.serialNumber.innerHTML = `№ ${patent.serial_number}`;
    this.category.innerHTML = patent.category_name ? patent.category_name : "Без категории";
    this.name.innerHTML = patent.name;
    this.description.innerHTML = patent.description;
  }

  async issue(){
    const response = await fetch( `api/patents/buy/${this.patent.serial_number}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify( {
        // #fix пустые значения
        name: this.contactName.value,
        email: this.contactEmail.value,
        phone: this.contactPhone.value
      } )
    } );
    const jsn = await response.json();

    if( !jsn.ok ) alert( `Ошибка. ${jsn.data}` );
    else{
      alert( "Заявка на оформление патента отправлена!" );

      this.contacts.dispatchEvent( new Event( "success" ) );
    }
  }

  on( e, handler ){
    this.contacts.addEventListener( e, handler );
  }
}

function createPatent( patent ){
  const structure = {};
  let element;

  structure.column = document.createElement( "div" );
  structure.column.className = "col-xs-12 col-sm-6 col-md-4 col-lg-4";

  structure.patentSection = document.createElement( "div" );
  structure.patentSection.className = "patent-section";
  structure.column.appendChild( structure.patentSection );

  structure.patent = document.createElement( "div" );
  structure.patent.className = "patent";
  structure.patentSection.appendChild( structure.patent );

  element = document.createElement( "div" );
  element.className = "patent-serialnumber";
  element.innerHTML = `№ ${patent.serial_number}`;
  structure.patent.appendChild( element );

  element = document.createElement( "div" );
  element.className = "patent-name";
  element.setAttribute( "name", "patentName" );
  element.innerHTML = patent.name;
  structure.patent.appendChild( element );

  element = document.createElement( "div" );
  element.className = "patent-image";
  element.setAttribute( "name", "patentImage" );
  element.style.backgroundImage = `url( "assets/img/patents/${patent.serial_number}.${patent.ext}" )`;
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundSize = "cover";
  element.style.backgroundPosition = "center center";
  structure.patent.appendChild( element );

  structure.textCenter = document.createElement( "div" );
  structure.textCenter.className = "text-center";
  structure.patentSection.appendChild( structure.textCenter );

  element = document.createElement( "button" );
  element.className = "patent-issue";
  element.innerHTML = "ОФОРМИТЬ ЗАЯВКУ";
  structure.textCenter.appendChild( element );

  return structure.column;
}

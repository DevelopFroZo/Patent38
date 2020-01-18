class PatentIssueForm{
  constructor( overlay ){
    this.image = document.querySelector( "#patentDetailImage" );
    this.serialNumber = document.querySelector( "#patentDetailSerialNumber" );
    this.name = document.querySelector( "#patentDetailName" );
    this.description = document.querySelector( "#patentDetailDescription" );
    this.overlay = overlay;

    this.patentDetail = document.querySelector( "#patentDetail" );
    this.contacts = document.querySelector( "#patentContacts" );
    this.issue_ = document.querySelector( "#issue" );
    this.contactName = document.querySelector( "#contactName" );
    this.contactEmail = document.querySelector( "#contactEmail" );
    this.contactPhone = document.querySelector( "#contactPhone" );
    this.contactsPersonal = document.querySelector( "#contactsPersonal" );

    document.querySelector( "#patentBuy" ).addEventListener( "click", () => this.openIssue() );
    document.querySelector( "#patentIssueFormClose" ).addEventListener( "click", () => this.closeIssue() );

    this.contactsPersonal.addEventListener( "change", ( e ) => this.issueToggle( e ) );
    this.issue_.addEventListener( "click", () => this.issue() );
  }

  clearIssue(){
    this.contactName.value = "";
    this.contactEmail.value = "";
    this.contactPhone.value = "";
    this.contactsPersonal.checked = false;
    this.issue_.classList.add( "disabled" );
    this.issue_.classList.remove( "enabled" );
    this.issue_.disabled = true;
  }

  openIssue(){
    this.patentDetail.classList.add( "hidden" );
    this.contacts.classList.remove( "hidden" );
  }

  closeIssue(){
    this.patentDetail.classList.remove( "hidden" );
    this.contacts.classList.add( "hidden" );
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

  open( patent ){
    this.clearIssue();
    this.patent = patent;

    this.image.style.backgroundImage = `url( "assets/img/patents/${patent.serial_number}.jpg" )`;
    this.image.style.backgroundRepeat = "no-repeat";
    this.image.style.backgroundSize = "contain";
    this.image.style.backgroundPosition = "center center";

    this.serialNumber.innerHTML = `№ ${patent.serial_number}`;
    this.name.innerHTML = patent.name;
    this.description.innerHTML = patent.description;

    this.overlay.open();
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
      alert( "Заявка на оформление патента отпраавлена!" );
      this.closeIssue();
      this.overlay.close();
    }
  }
}

function fillPatent( patents, i, patentIssueForm ){
  document.getElementsByName( "patentSerialNumber" )[i].innerHTML = `№ ${patents[i].serial_number}`;
  document.getElementsByName( "patentName" )[i].innerHTML = patents[i].name;

  image = document.getElementsByName( "patentImage" )[i];
  image.style.backgroundImage = `url( "assets/img/patents/${patents[i].serial_number}.jpg" )`;
  image.style.backgroundRepeat = "no-repeat";
  image.style.backgroundSize = "cover";
  image.style.backgroundPosition = "center center";

  document
    .getElementsByName( "patentSection" )[i]
    .addEventListener( "click", () => patentIssueForm.open( patents[i] ) );
}

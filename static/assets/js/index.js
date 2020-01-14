async function navbarControl(){
  const response = await fetch( "api/auth/isLogged" );
  const isLogged = ( await response.json() ).data;

  const authLink = document.querySelector( "#authLink" );
  const uploadLi = document.querySelector( "#uploadLi" );

  if( isLogged ){
    authLink.href = "/logout";
    authLink.innerHTML = "SIGN OUT";

    uploadLi.classList.toggle( "hidden" );
  }
}

function patentIssue( patent ){
  const image = document.querySelector( "#patentDetailImage" );

  image.style.backgroundImage = `url( "assets/img/patents/${patent.id}.jpg" )`;
  image.style.backgroundRepeat = "no-repeat";
  image.style.backgroundSize = "contain";
  image.style.backgroundPosition = "center center";

  document.querySelector( "#patentDetailSerialNumber" ).innerHTML = `№ ${patent.id}`;
  document.querySelector( "#patentDetailName" ).innerHTML = patent.name;
  document.querySelector( "#patentDetailDescription" ).innerHTML = patent.description;
  document.querySelector( "#overlay" ).classList.remove( "hidden" );
}

function stub(){
  const patents = [
    {
      id: 2640844,
      name: `Способ спуска обсадной колонны в горизонтальном стволе большой протяженности`,
      description:
        `Патент на изобретение № 2640844 «Способ спуска обсадной колонны в горизонтальном стволе большой протяженности?»

Авторы: Вахромеев А.Г., Сверкунов С.А., Иванишин В.М., Сираев Р.У., Заливин В.Г., Акчурин Р.Х., Маликов Д.А., Сотников А.К.

Заявка № 2017109780

Приоритет изобретения 23 марта 2017 г.

Зарегистрировано в Государственном реестре изобретений РФ 12.01.2018 г.

Патентообладатель: Федеральное государственное бюджетное учреждение науки Институт земной коры СО РАН (ИЗК СО РАН)

Срок действия патента истекает 23 марта 2037 г.`
    }
  ];
  let image;

  for( let i = 0; i < 3; i++ ){
    document.getElementsByName( "patentSerialNumber" )[i].innerHTML = `№ ${patents[0].id}`;
    document.getElementsByName( "patentName" )[i].innerHTML = patents[0].name;

    image = document.getElementsByName( "patentImage" )[i];
    image.style.backgroundImage = `url( "assets/img/patents/${patents[0].id}.jpg" )`;
    image.style.backgroundRepeat = "no-repeat";
    image.style.backgroundSize = "cover";
    image.style.backgroundPosition = "center center";

    document
      .getElementsByName( "patentSection" )[i]
      .addEventListener( "click", () => patentIssue( patents[0] ) );
  }
}

async function index(){
  navbarControl();
  stub();

  document
    .querySelector( "#overlayClose" )
    .addEventListener( "click", () => {
      document.querySelector( "#overlay" ).classList.add( "hidden" );
    } );
}

window.addEventListener( "load", index );

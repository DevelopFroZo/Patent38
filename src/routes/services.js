const express = require( "express" );

const router = express.Router();

router.post( "/issue", ( req, res ) => {
  let service;

  switch( req.body.service ){
    case "signs": service = "товарного знака"; break;
    case "patents": service = "изобретения или полезной модели"; break;
    case "industrialModels": service = "промышленного образца"; break;
    case "EVMAndDB": service = "программы для ЭВМ или БД"; break;
    default: service = null;
  }

  if( service === null )
    return res.error( 9 );

  req.mail.send( process.env.EMAIL_ISSUE_TO, "Оформление услуги", `
    Запрос на оформление услуги "Регистрация ${service}"
    Контакты:
    - Имя: ${req.body.name}
    - Email: ${req.body.email}
    - Тел.: ${req.body.phone}
  ` );

  res.success();
} );

module.exports = router;

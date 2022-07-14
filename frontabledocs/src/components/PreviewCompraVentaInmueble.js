export default function PreviewCompraVentaInmueble({valores}) {

    // const valores = {
    //     lugar: "Mi Casa",
    //     fecha: "Fecha De Prueba",
    //     nombreVendedor: "Vendedor",
    //     nombreComprador: "Comprador",
    //     estadoCivilComprador: "soltero",
    //     estadoCivilVendedor: "casado",
    //     domicilioComprador: "C/COMPRADOR",
    //     domicilioVendedor: "C/VENDEDOR",
    //     dniComprador: "88888888",
    //     dniVendedor: "00000000",
    //     direccionInmueble: "C/COMPRAVENTA",
    //     superficieContstruida: "0000",
    //     superficieUtil: "1111",
    //     referenciaCatastral: "REFERENCIA",
    //     registroPropiedad: "REGISTRO PROPIEDAD",
    //     cargasGravamenes:"NO TIENE CARGAS NI GRAVAMENES",
    //     ocupantes: "NO TIENE OCUPANTES",
    //     precioEscrito: "VEINTE EUROS",
    //     precioNumero: "20",
    //     plazoPago: "7 días",
    //     senyal: "10",
    //     fechaLimite: "4 de Abril",
    //     precioMenosSenal: "DIEZ EUROS",
    //     precioMenosSenalNumero: "10",
    //     rangoFechaEscritura: "7 de junio y 15 de junio de 2022",
    //     juzgado: "el Juzgado de Torremolinos"
    // }

    return (
        <div contentEditable='true' className='p-5 pt-5'>
            <h3 align='center'><b>CONTRATO PRIVADO DE COMPRAVENTA DE INMUEBLE</b></h3>
            <br></br>
            <p className='mt-4'>En  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.lugar}</span> a  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.fecha}</span></p>
            <h4 align='center'><b>REUNIDOS</b></h4>
            <p className='mt-4'>De una parte, Don/Doña  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreVendedor}</span>, mayor de edad,  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.estadoCivilVendedor}</span>, con domicilio en  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.domicilioVendedor}</span> y con DNI  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.dniVendedor}</span></p>
            <p>De otra parte, Don/Doña  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreComprador}</span>, mayor de edad,  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.estadoCivilComprador}</span>, con domicilio en  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.domicilioComprador}</span> y con DNI  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.dniComprador}</span> </p>
            <h4 align='center'><b>INTERVIENEN</b></h4>
            <p>Don/Doña  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreVendedor}</span>, en su propio nombre y representación. En los sucesivo EL VENDEDOR.</p>
            <p>Y  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreComprador}</span>, en su propio nombre y representación. En lo sucesivo EL COMPRADOR.</p>
            <p>Ambas partes o, reconociéndose a su vez ambas partes la capacidad legal necesaria para este CONTRATO PRIVADO DE COMPRAVENTA y a tal fin </p>
            <h4 align='center'><b>EXPONEN</b></h4>
            <p>I.- Que Don/Doña  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreVendedor}</span> es legítima propietaria, de la siguiente finca:  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.direccionInmueble}</span> ; con una superficie útil aproximada de  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.superficieUtil}</span> metros cuadrados, una superficie construida de  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.superficieContstruida}</span> metros cuadrados incluidas las partes proporcionales de zonas comunes. Consta de varias habitaciones y servicios.</p>
            <p><b>Referencia catastral:  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.referenciaCatastral}</span></b></p>
            <p>Inscripción. - Inscrita en el Registro de la Propiedad  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.registroPropiedad}</span> </p>
            <p>Cargas y Gravámenes. -  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.cargasGravamenes}</span> </p>
            <p>Arrendatarios y Ocupantes. -  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.ocupantes}</span></p>
            <p>II.- Que teniendo convenida los comparecientes el otorgamiento del presente contrato de   compraventa  de conformidad con las siguientes:</p>
            <h4 align='center'><b>ESTIPULACIONES</b></h4>
            <p><b>Primera-</b> Que  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreVendedor}</span> como legítimo propietario de la finca antes descrita, VENDE a Don  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreComprador}</span>, que COMPRA la finca descrita en el exponiendo I, como cuerpo cierto,  libre de cargas, gravámenes y arrendatarios, al corriente en el pago de contribuciones, cuotas de comunidad de propietarios y otros arbitrios al día de la firma de la escritura pública.</p>
            <p><b>Segunda-</b> El precio total de la presente Compraventa es el de  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.precioEscrito}</span> ( <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.precioNumero}</span>€) que se abonarán de la siguiente forma:</p>
            <p>1) El importe de  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.precioEscrito}</span> ( <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.precioNumero}</span>€) que se abonarán mediante transferencia bancaria, en el plazo de  <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.plazoPago}</span> a contar desde la firma, a la cuenta con IBAN ES, cuyo titular es el Doña.</p>
            <p>Transcurrido el plazo mencionado sin que se haga efectivo el pago mediante la meritada transferencia, el presente contrato quedará absolutamente resuelto y extinguido, quedando la parte vendedora expedita para disponer del inmueble objeto del presente contrato, sin nada que el comprador puedan reclamar a la vendedora.</p>
            <p>Este pago se efectúa en un doble concepto:</p>
            <p>a) En calidad de arras penitenciales, por lo que en el supuesto que la futura compraventa no se llevase a efecto por causa imputable al comprador, perderá éste la suma entregada. Si la no formalización fuese imputable a la vendedora, devolverá ésta la cantidad total recibida por duplicado. </p>
            <p>b.)	<span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.senyal}</span>Euros, en calidad de señal que será deducida del precio de compra que se entregará el día de otorgamiento de Escritura Pública de compraventa y que se indica más adelante.</p>
            <p>La señal entregada tendrá validez hasta el <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.fechaLimite}</span> fecha límite en que se formalizará la escritura pública de compraventa. </p>
            <p>2)	La cantidad restante, <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.precioMenosSenal}</span> (€ <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.precioMenosSenalNumero}</span>), entre el <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.rangoFechaEscritura}</span>, fecha que las partes acuerdan como límite para otorgar la escritura pública de Compra venta,  ante el notario, designado por la parte compradora, debiendo notificar la compradora con 7 días de antelación el lugar, día y hora para su otorgamiento.</p>
            <p><b>Tercera-</b> A la fecha de formalización de la Escritura Pública de compraventa el comprador recibirá la posesión de la vivienda  en concepto de dueño en virtud del otorgamiento de la escritura de compraventa.</p>
            <p><b>Cuarta-</b> Los gastos del otorgamiento de dicha Escritura Pública serán por cuenta del comprador, excepto el Impuesto del Incremento del valor de los Terrenos de naturaleza Urbana), que será abonado por  la vendedora.</p>
            <p>Las partes acuerdan prorratear los pagos del Impuesto de Bienes Inmuebles (IBI), Basura y  cuota de comunidad de propietarios, correspondiendo a la parte vendedora, la parte proporcional hasta la entrega de la posesión y firma de escritura pública de compraventa, y la parte compradora, la parte proporcional a partir de dicha fecha. </p>
            <p><b>Quinta.-</b> De conformidad a los dispuesto en el real Decreto 235/2013, de 5 de Abril, por el que se aprueba el “Procedimiento Básico para la Certificación de la Eficiencia Energética de los Edificios”, en vigor desde el día 14/05/2013, se aportará  con anterioridad a la firma de la escritura Certificado de Eficiencia Energética, debidamente inscrito en el registro correspondiente.</p>
            <p>Sexta- Para cuantas divergencias pudieran surgir de la interpretación y ejecución de este contrato, ambas partes con expresa renuncia  a cualquier fuero o domicilio que les pudiera corresponderles, acuerdan someterse expresamente a la jurisdicción y competencia de <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.juzgado}</span></p>
            <p><b>Séptima.-</b> Domicilio para notificaciones. </p>
            <p>7.1. Las partes acuerdan expresamente designar como domicilio para cualquier notificación relacionada con el presente contrato, los siguientes:</p>
            <p><b>Don/Doña <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreVendedor}</span></b></p>
            <br></br>
            <br></br>
            <br></br>
            {valores.firma1 ? 
            <img src={valores.firma1} style={{maxHeight:"250px"}}></img> :
            ""
            }
            <br></br>
            <p><span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.domicilioVendedor}</span></p>
            <p><b>Don/Doña <span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.nombreComprador}</span></b></p>
            <br></br>
            <br></br>
            <br></br>
            {valores.firma2 ? 
            <img src={valores.firma2} style={{maxHeight:"250px"}}></img> :
            ""
            }
            <br></br>
            <p><span className='bg-secondary text-white rounded-pill px-2 py-1'>{valores.domicilioComprador}</span></p>
            <br></br>
            <p>7.2  Todas las notificaciones a que se hace referencia en el presente contrato o las que correspondiera realizar, deberán realizarse por escrito, y en la forma que se pueda acreditar su recepción y contenido.</p>
            <p>Ambas partes firman el presente contrato por duplicado y a un solo efecto, en prueba de conformidad y aceptación en lugar y fecha que se indican en el encabezamiento.</p>
        </div>
    )
}
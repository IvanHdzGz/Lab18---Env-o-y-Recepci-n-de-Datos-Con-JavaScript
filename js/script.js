// Declaramos la función asíncrona que se ejecutará al dar clic en el botón "Buscar".
async function buscarEmpleado() {
  // Obtenemos el valor del campo de texto "clave" ingresado por el usuario.
  const clave = document.getElementById("clave").value.trim();

  // Validamos que se haya ingresado una clave.
  if (!clave) {
    document.getElementById("respuesta").innerHTML =
      "Por favor, ingresa una clave.";
    return;
  }

  //
  let myPromise = new Promise(function (resolve, reject) {
    // Creamos un objeto XMLHttpRequest para realizar la solicitud HTTP.
    let req = new XMLHttpRequest();

    // Abrimos la conexión con el método POST y la URL del archivo PHP que recibirá los datos.
    req.open(
      "POST",
      "https://dawcampusjalpa2025.duckdns.org/ejercicio18/api/empleado.php"
    );

    // Indicamos que enviaremos los datos en formato JSON.
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.onload = function () {
      // Si la solicitud HTTP tuvo exito
      if (req.status >= 200 && req.status < 300) {
        try {
          // Convertimos la respuesta a un objetos JSON y resolvemos la promesa.
          resolve(JSON.parse(req.responseText));
        } catch (error) {
          reject(new Error("La respuesta JSON no es válida."));
        } // Fin del try-catch
      }
    }; // Fin del onload

    // Evento que se ejecuta si hay un error de red o CORS.
    req.onerror = function () {
      reject(new Error("Error de red o CORS"));
    }; // Fin del onerror

    // Enviamos los datos al servidor en formato JSON con la clave del empleado.
    req.send(JSON.stringify({ clave: clave }));
  }); // Fin de la promesa

  try {
    // Esperamos la respuesta del servidor.
    const data = await myPromise;

    // Mostramos los datos obtenidos en el elemento con id "respuesta".
    // Si existe el campo 'nombre', mostramos toda la información del empleado.
    // Si no, mostramos el mensaje devuelto por el servidor ("Empleado no encontrado").
    // La respuesta ya viene en el objeto JSON, no es necsario utilizar JSON. parse.
    console.log(data);
    if (data.clave === undefined) {
      document.getElementById(
        "respuesta"
      ).innerHTML = `<span style='color:red;'>${data.mensaje}</span>`;
    } else {
      document.getElementById("respuesta").innerHTML = `
        Clave del cliente: ${data.clave}<br>
        Nombre: ${data.nombre}<br>
        Apellido: ${data.puesto}<br>
        Salario: ${data.salario}<br>`;
    }
  } catch (error) {
    // Si ocurre un error en la conexión o en la respuesta.
    document.getElementById("respuesta").innerHTML = "Error: " + error.message;
  }
} // Fin de la función async

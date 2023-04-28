require("dotenv").config();
const request = require("supertest");
const Server = require("../../models/Server");
const Usuario = require("../../models/Usuario");

describe("Pruebas en endpoints de usuarios", () => {
  let server = new Server();

  beforeEach(() => {
    server = new Server();
  });

  test("Debe de retornar un JSON con los usuarios", async () => {
    const res = await request(server.app).get(`${server.usuarios}`);

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual(expect.any(Object));
    expect(res.body.msg).toBe("getApi - Controlador");
    expect(res.body.total_usuarios_activos).toBeGreaterThanOrEqual(0);
    expect(res.body.usuarios).toEqual(expect.any(Array));
  });

  test("Debe de retornar un JSON con el nuevo usuario creado", async () => {
    const usuario = {
      nombre: "Test",
      correo: "test@gmail.com",
    };
    const res = await request(server.app)
      .post(`${server.usuarios}`)
      .send(usuario);

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual(expect.any(Object));
    expect(res.body.msg).toBe("postApi - Controlador");
    expect(res.body.usuario).toEqual(expect.objectContaining(usuario));
  });

  test("Debe de actualizar un usuario y retornar un JSON con los datos actualizados", async () => {
    const usuario = {
      nombre: "TestPUT",
      correo: "testPUT@gmail.com",
    };

    // Crear el usuario
    const usuarioCreado = await request(server.app)
      .post(`${server.usuarios}`)
      .send(usuario);

    const usuarioModificado = {
      ...usuarioCreado.body.usuario,
      nombre: "Test Modificado",
    };

    const res = await request(server.app)
      .put(`${server.usuarios}/${usuarioCreado.body.usuario.uid}`)
      .send(usuarioModificado);

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual(expect.any(Object));
    expect(res.body.msg).toBe("putApi - Controlador");
    expect(res.body.body).toEqual(expect.objectContaining(usuarioModificado));
  });

  test("Debe de desactivar un usuario y retornar un JSON con el usuario desactivado", async () => {
    const usuario = {
      nombre: "TestDELETE",
      correo: "testDELETE@gmail.com",
    };

    // Crear el usuario
    const usuarioCreado = await request(server.app)
      .post(`${server.usuarios}`)
      .send(usuario);

    const res = await request(server.app).delete(
      `${server.usuarios}/${usuarioCreado.body.usuario.uid}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual(expect.any(Object));
    expect(res.body.msg).toBe("deleteApi - Controlador");
    expect(res.body.usuario).toEqual({
      correo: "testDELETE@gmail.com",
      estado: false,
      nombre: "TestDELETE",
      uid: usuarioCreado.body.usuario.uid,
    });
  });
});

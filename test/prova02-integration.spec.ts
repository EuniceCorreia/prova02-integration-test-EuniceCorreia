import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';

describe('CrudCrud API - 12 testes para Sonar', () => {
  const baseUrl = 'https://crudcrud.com/api/bcf3e02635d94e2f87a375620daee64b';
  const resource = 'products';

  let productId = '';
  let secondProductId = '';

  beforeAll(() => {
    pactum.request.setDefaultTimeout(10000);
  });

  // =========================
  // GET inicial
  // =========================

  it('01 - GET all resources - positive (lista vazia)', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${resource}`)
      .expectStatus(StatusCodes.OK);
  });

  // =========================
  // POST
  // =========================

  it('02 - POST resource - positive', async () => {
    productId = await pactum
      .spec()
      .post(`${baseUrl}/${resource}`)
      .withJson({
        name: 'Produto 1',
        price: 100
      })
      .expectStatus(StatusCodes.CREATED)
      .returns('_id');
  });

  it('03 - POST resource - negative (body ausente)', async () => {
    const response = await pactum
      .spec()
      .post(`${baseUrl}/${resource}`);

    expect([400, 415]).toContain(response.statusCode);
  });

  // =========================
  // GET por ID
  // =========================

  it('04 - GET resource by id - positive', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${resource}/${productId}`)
      .expectStatus(StatusCodes.OK);
  });

  it('05 - GET resource by id - negative (not found)', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${resource}/65ffffffffffffffffffffff`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('06 - GET all resources - positive (com dois registros)', async () => {
    secondProductId = await pactum
      .spec()
      .post(`${baseUrl}/${resource}`)
      .withJson({
        name: 'Produto 2',
        price: 200
      })
      .expectStatus(StatusCodes.CREATED)
      .returns('_id');

    await pactum
      .spec()
      .get(`${baseUrl}/${resource}`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike([
        { _id: productId },
        { _id: secondProductId }
      ]);
  });

  // =========================
  // PUT
  // =========================

  it('07 - PUT resource - positive', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/${resource}/${productId}`)
      .withJson({
        name: 'Produto 1 editado',
        price: 150
      })
      .expectStatus(StatusCodes.OK);
  });

  it('08 - PUT resource - negative (id inexistente)', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/${resource}/65ffffffffffffffffffffff`)
      .withJson({
        name: 'Inválido',
        price: 999
      })
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('09 - PUT resource - negative (enviando _id no body)', async () => {
    const response = await pactum
      .spec()
      .put(`${baseUrl}/${resource}/${productId}`)
      .withJson({
        _id: productId,
        name: 'Produto inválido',
        price: 999
      });

    expect([400, 500]).toContain(response.statusCode);
  });

  // =========================
  // DELETE
  // =========================

  it('10 - DELETE resource - positive', async () => {
    await pactum
      .spec()
      .delete(`${baseUrl}/${resource}/${secondProductId}`)
      .expectStatus(StatusCodes.OK);
  });

  it('11 - DELETE resource - negative (id inexistente)', async () => {
    await pactum
      .spec()
      .delete(`${baseUrl}/${resource}/65ffffffffffffffffffffff`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('12 - DELETE resource - positive + GET por id depois deve retornar 404', async () => {
    await pactum
      .spec()
      .delete(`${baseUrl}/${resource}/${productId}`)
      .expectStatus(StatusCodes.OK);

    await pactum
      .spec()
      .get(`${baseUrl}/${resource}/${productId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

});
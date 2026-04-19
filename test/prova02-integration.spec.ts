import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';

describe('CrudCrud API - GET', () => {
  const baseUrl = 'https://crudcrud.com/api/6cc3d99ce8884b729de0a19c6a7cf576';
  const resource = 'products';

  const invalidId = '65ffffffffffffffffffffff';

  beforeAll(() => {
    pactum.request.setDefaultTimeout(10000);
  });

  it('GET all resources - positive', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${resource}`)
      .expectStatus(StatusCodes.OK)
      .expectJsonLike([]); // retorna lista (mesmo vazia)
  });

  it('GET resource by id - negative (not found)', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${resource}/${invalidId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });
});
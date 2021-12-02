/// <reference types="cypress" />
import { EthConnection } from "@/components/EthConnection";
import sample_praise_single from '../fixtures/sample_praise_single.json';
import sample_praise_array from '../fixtures/sample_praise_array.json';


describe("Quantification round", () => {
  context("An admin", () => {
    before(() => {
      cy.setToken()
    })
    after(() => {
      cy.restartBackend()
    })
    it("can upload a single request", () => {
      cy.request('POST', 'api/praise/create/discord', sample_praise_single).then(
        (createPraiseResponse) => {
          expect(createPraiseResponse.body[0]).to.have.property('id')
          expect(createPraiseResponse.body[0]).to.have.property('giver')
          expect(createPraiseResponse.body[0]).to.have.property('recipient')
          expect(createPraiseResponse.body[0]).to.have.property('source')

      })
      cy.request('GET', '/api/praise/all').then(
        (getPraisesResponse) => {
          expect(getPraisesResponse.body.totalElements).to.equal(1)
          expect(getPraisesResponse.body.content).to.have.length(1)
      })
    })
    it("can upload an array of requests", () => {
      cy.log(sample_praise_array)
      cy.submit_praise_array(sample_praise_array)
      cy.request('GET', '/api/praise/all').then(
        (getPraisesResponse) => {
          expect(getPraisesResponse.body.totalElements).to.equal(10)
          expect(getPraisesResponse.body.content).to.have.length(10)
      })
    })
  })
})
